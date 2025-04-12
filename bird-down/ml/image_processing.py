import cv2
import numpy as np
from ultralytics import YOLO
from pathlib import Path
import math

SEG_MODEL = 'ml/models/yolov8s-seg.pt'
CLS_MODEL = 'ml/models/bestSmall.pt'

def run_segmentation(img_path, seg_model_path=SEG_MODEL):
    seg_model = YOLO(seg_model_path)
    results = seg_model(img_path)[0]

    if results.masks is None:
        raise ValueError("No segmentation mask found")

    orig_img = results.orig_img
    mask_tensor = results.masks.data[0].cpu().numpy().astype(np.uint8)
    mask_resized = cv2.resize(mask_tensor, (orig_img.shape[1], orig_img.shape[0]), interpolation=cv2.INTER_NEAREST)

    return mask_resized, results

def get_bounding_box_from_mask(mask):
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        raise ValueError("No contour found")

    biggest = max(contours, key=cv2.contourArea)
    x, y, w, h = cv2.boundingRect(biggest)
    return x, y, w, h, biggest

def crop_image(image, x, y, w, h, padding=10):
    h_img, w_img = image.shape[:2]
    x1 = max(x - padding, 0)
    y1 = max(y - padding, 0)
    x2 = min(x + w + padding, w_img)
    y2 = min(y + h + padding, h_img)
    return image[y1:y2, x1:x2]

def run_classification(img_array, cls_model_path=CLS_MODEL):
    cls_model = YOLO(cls_model_path)
    results = cls_model(img_array)
    probs = results[0].probs
    top5 = probs.top5
    return [(cls_model.names[i], probs.data[i].item()) for i in top5]

def image_rating(certainty_score, og_img_w, og_img_h, box_x, box_y, box_w, box_h, verbose=True):
    og_img_a = og_img_h * og_img_w
    box_a = box_w * box_h

    cert_rating = min(max(certainty_score / 100.0 * 100, 0), 100)

    box_center = (box_x + box_w / 2, box_y + box_h / 2)

    thirds_x = [og_img_w / 3, 2 * og_img_w / 3]
    thirds_y = [og_img_h / 3, 2 * og_img_h / 3]
    thirds = [(x, y) for x in thirds_x for y in thirds_y]
    max_distance = math.hypot(og_img_w, og_img_h) / 3  
    closest_dist = min([math.hypot(box_center[0] - tx, box_center[1] - ty) for tx, ty in thirds])
    comp_rating = max(0, 100 - (closest_dist / max_distance) * 100)

    ratio = box_a / og_img_a
    if ratio < 0.1:
        area_rating = ratio * 500
    elif ratio > 0.6:
        area_rating = (1 - ratio) * 200
    else:
        area_rating = 100

    clip_margin = 5
    clip_penalty = 0
    if (box_x <= clip_margin or
        box_y <= clip_margin or
        box_x + box_w >= og_img_w - clip_margin or
        box_y + box_h >= og_img_h - clip_margin):
        clip_penalty = 15

    quality_rating = round((0.5 * cert_rating + 0.3 * comp_rating + 0.2 * area_rating) - clip_penalty, 2)
    quality_rating = max(0, quality_rating)

    if verbose:
        print(f"Certainty Score: {cert_rating:.2f}%")
        print(f"Composition Score: {comp_rating:.2f}%")
        print(f"Subject Size Score: {area_rating:.2f}%")
        if clip_penalty:
            print(f"Clipping Penalty Applied: -{clip_penalty}%")
        print(f"Final Image Quality Score: {quality_rating:.2f}%")

    return quality_rating

# HIT THIS ROUTE TO DO THINGS YAY
def process_image(img_path, img_name, seg_model_path=SEG_MODEL, cls_model_path=CLS_MODEL, save_dir='ml/output'):
    image_path = Path(img_path)
    image = cv2.imread(str(image_path))

    mask, seg_result = run_segmentation(image_path, seg_model_path)
    x, y, w, h, outline = get_bounding_box_from_mask(mask)

    outline_img = image.copy()
    cv2.drawContours(outline_img, [outline], -1, (0, 255, 0), 2)
    cv2.rectangle(outline_img, (x, y), (x + w, y + h), (0, 0, 255), 2)
    cv2.imwrite(f'{save_dir}/{img_name}_outlined.jpg', outline_img)

    cropped_img = crop_image(image, x, y, w, h)
    cv2.imwrite(f'{save_dir}/{img_name}_output.jpg', cropped_img)

    resized = cv2.resize(cropped_img, (224, 224))
    results = run_classification(resized, cls_model_path)

    print("Classification Top 5:")
    for i, (cls, prob) in enumerate(results):
        print(f"{i+1}. {cls}: {prob:.2%}")

    print("Bounding Box Info:")
    print(f"Location: x={x}, y={y}, width={w}, height={h}")

    best_score = results[0][1] * 100
    quality_score = image_rating(best_score, image.shape[1], image.shape[0], x, y, w, h)

    return results, quality_score

# bbprocess_image("./input/mall.jpg", "mall")

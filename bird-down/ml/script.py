import cv2
import numpy as np
from ultralytics import YOLO
from pathlib import Path

SEG_MODEL = 'models/yolov8s-seg.pt'          
CLS_MODEL = 'best.pt' 
IMG_PATH = 'input/mall-copy.jpg'

def run_segmentation(img_path):
    seg_model = YOLO(SEG_MODEL)
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

def run_classification(img_array):
    cls_model = YOLO(CLS_MODEL)
    results = cls_model(img_array)
    probs = results[0].probs
    top5 = probs.top5
    return [(cls_model.names[i], probs.data[i].item()) for i in top5]

def main():
    image_path = Path(IMG_PATH)
    image = cv2.imread(str(image_path))

    mask, seg_result = run_segmentation(image_path)
    x, y, w, h, outline = get_bounding_box_from_mask(mask)

    outline_img = image.copy()
    cv2.drawContours(outline_img, [outline], -1, (0, 255, 0), 2)
    cv2.rectangle(outline_img, (x, y), (x + w, y + h), (0, 0, 255), 2)
    cv2.imwrite("results/outlined.jpg", outline_img)

    cropped_img = crop_image(image, x, y, w, h)
    cv2.imwrite("results/output.jpg", cropped_img)

    resized = cv2.resize(cropped_img, (224, 224)) 
    results = run_classification(resized)

    print("Classification Top 5:")
    for i, (cls, prob) in enumerate(results):
        print(f"{i+1}. {cls}: {prob:.2%}")

    print("Bounding Box Info:")
    print(f"Location: x={x}, y={y}, width={w}, height={h}")

if __name__ == "__main__":
    main()

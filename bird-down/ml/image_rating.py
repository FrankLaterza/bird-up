import argparse
import math

certainty_score = 32.98
og_img_w = 194
og_img_h = 190
og_img_a = og_img_h * og_img_w

box_x = 57
box_y = 18
box_w = 137
box_h = 149
box_a = box_w * box_h

cert = min(max(certainty_score / 100.0 * 100, 0), 100)

box_center = (box_x + box_w / 2, box_y + box_h / 2)

thirds_x = [og_img_w / 3, 2 * og_img_w / 3]
thirds_y = [og_img_h / 3, 2 * og_img_h / 3]
thirds = [(x, y) for x in thirds_x for y in thirds_y]
max_distance = math.hypot(og_img_w, og_img_h) / 3  
closest_dist = min([math.hypot(box_center[0] - tx, box_center[1] - ty) for tx, ty in thirds])
comp = max(0, 100 - (closest_dist / max_distance) * 100) 

ratio = box_a / og_img_a
if ratio < 0.1:
    area = ratio * 500 
elif ratio > 0.6:
    area = (1 - ratio) * 200
else:
    area = 100 

clip_margin = 5
clip_penalty = 0
if (box_x <= clip_margin or
    box_y <= clip_margin or
    box_x + box_w >= og_img_w - clip_margin or
    box_y + box_h >= og_img_h - clip_margin):
    clip_penalty = 15 

quality = round((0.5 * cert + 0.3 * comp + 0.2 * area) - clip_penalty, 2)
quality = max(0, quality)

# Output
print(f"Certainty Score: {cert:.2f}%")
print(f"Composition Score: {comp:.2f}%")
print(f"Subject Size Score: {area:.2f}%")
if clip_penalty:
    print(f"Clipping Penalty Applied: -{clip_penalty}%")
print(f"Final Image Quality Score: {quality:.2f}%")

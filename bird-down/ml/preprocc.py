import os
import shutil
from pathlib import Path

dataset_root = "CUB_200_2011/CUB_200_2011/CUB_200_2011"
images_folder = os.path.join(dataset_root, "images")
images_txt = os.path.join(dataset_root, "images.txt")
labels_txt = os.path.join(dataset_root, "image_class_labels.txt")
split_txt = os.path.join(dataset_root, "train_test_split.txt")
classes_txt = os.path.join(dataset_root, "classes.txt")

output_root = "birds_yolo_classification"
train_dir = os.path.join(output_root, "train")
val_dir = os.path.join(output_root, "val")

with open(images_txt) as f:
    image_id_to_name = {int(line.split()[0]): line.strip().split()[1] for line in f}

with open(labels_txt) as f:
    image_id_to_class = {int(line.split()[0]): int(line.strip().split()[1]) for line in f}

with open(split_txt) as f:
    image_id_to_split = {int(line.split()[0]): int(line.strip().split()[1]) for line in f}

with open(classes_txt) as f:
    class_id_to_name = {i + 1: line.strip().split(' ', 1)[1].replace(' ', '_') for i, line in enumerate(f)}

for c in class_id_to_name.values():
    os.makedirs(os.path.join(train_dir, c), exist_ok=True)
    os.makedirs(os.path.join(val_dir, c), exist_ok=True)

for image_id, file_name in image_id_to_name.items():
    class_id = image_id_to_class[image_id]
    split = image_id_to_split[image_id]
    class_name = class_id_to_name[class_id]

    src = os.path.join(images_folder, file_name)
    dst_folder = os.path.join(train_dir if split == 1 else val_dir, class_name)
    shutil.copy(src, dst_folder)

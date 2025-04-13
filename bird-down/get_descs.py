import requests
from pathlib import Path

INPUT_FILE = "ml/data/CUB_200_2011/classes.txt"
OUTPUT_FILE = "bird_descs.txt"
NOT_FOUND_FILE = "not_found.txt"

custom_title_map = {
    "Brewer Blackbird": "Brewer's_Blackbird",
    "Chuck will Widow": "Chuck-Will's-Widow",
    "Brandt Cormorant": "Brandt's_Cormorant",
    "Gray crowned Rosy Finch": "Gray-crowned_Rosy_Finch",
    "Great Crested Flycatcher": "Great_Crested_Flycatcher",
    "Heermann Gull": "Heermann's_Gull",
    "Clark Nutcracker": "Clark's_Nutcracker",
    "Scott Oriole": "Scott's_Oriole",
    "Western Wood Pewee": "Western_Wood_Pewee",
    "Whip poor Will": "Eastern_whip-poor-will",
    "Great Grey Shrike": "Great_Grey_Shrike",
    "Baird Sparrow": "Baird's_Sparrow",
    "Brewer Sparrow": "Brewer's_Sparrow",
    "Harris Sparrow": "Harris's_Sparrow",
    "Henslow Sparrow": "Henslow's_Sparrow",
    "Le Conte Sparrow": "LeConte's_Sparrow",
    "Lincoln Sparrow": "Lincoln's_Sparrow",
    "Nelson Sharp tailed Sparrow": "Nelson's_sparrow",
    "Cape Glossy Starling": "Cape_Starling",
    "Black throated Blue Warbler": "Black-throated_blue_warbler",
    "Cape May Warbler": "Cape_May_Warbler",
    "Swainson Warbler": "Swainson's_Warbler",
    "Wilson Warbler": "Wilson's_Warbler",
    "American Three toed Woodpecker": "American_three-toed_woodpecker",
    "Bewick Wren": "Bewick's_Wren",
}

def format_name(raw_name):
    return raw_name.split('.', 1)[-1].replace('_', ' ').strip()

def format_wikipedia_title(bird_name):
    if bird_name in custom_title_map:
        return custom_title_map[bird_name]

    words = bird_name.split()
    if len(words) == 3:
        return f"{words[0]}-{words[1]}_{words[2]}"

    return bird_name.replace(' ', '_')

def get_wikipedia_summary(title):
    url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{title}"
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            return response.json().get("extract", "")
        return None
    except requests.RequestException:
        return None

def main():
    input_path = Path(INPUT_FILE)
    output_path = Path(OUTPUT_FILE)
    not_found_path = Path(NOT_FOUND_FILE)

    with input_path.open("r") as f:
        class_names = [line.strip() for line in f if line.strip()]

    with output_path.open("w", encoding="utf-8") as out_f, not_found_path.open("w", encoding="utf-8") as nf:
        for entry in class_names:
            index, raw_name = entry.split(maxsplit=1)
            bird_name = format_name(raw_name)
            wiki_title = format_wikipedia_title(bird_name)
            summary = get_wikipedia_summary(wiki_title)

            if summary:
                out_f.write(f"{index}. {bird_name}\n{summary}\n\n")
                print(f"Found: {bird_name} → {wiki_title}")
            else:
                nf.write(f"{index}. {bird_name}\n")
                print(f"Not found: {bird_name} → {wiki_title}")

if __name__ == "__main__":
    main()

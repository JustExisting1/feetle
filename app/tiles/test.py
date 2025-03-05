import requests
import os

def download_champion_images():
    champion_data_url = "https://ddragon.leagueoflegends.com/cdn/14.9.1/data/en_US/champion.json"
    response = requests.get(champion_data_url)
    champion_data = response.json()["data"]

    base_image_url = "https://ddragon.leagueoflegends.com/cdn/14.9.1/img/champion/"
    for champion_name, champion_info in champion_data.items():
        champion_id = champion_info["id"]
        image_url = f"{base_image_url}{champion_id}.png"
        download_path = f"tiles/{champion_id}.png"

        # Görseli indir
        download_image(image_url, download_path)
        print(f"{champion_name} görseli indirildi.")

def download_image(url, save_path):
    # Görseli indir ve kaydet
    response = requests.get(url)
    with open(save_path, 'wb') as f:
        f.write(response.content)

def main():
    if not os.path.exists("champion_images"):
        os.makedirs("champion_images")

    download_champion_images()

if __name__ == "__main__":
    main()

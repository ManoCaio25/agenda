from __future__ import annotations

import json
from pathlib import Path

import numpy as np
from PIL import Image


IMAGE_SIZE = (224, 224)


def load_class_names(path: Path) -> list[str]:
    """Carrega o mapeamento de classes salvo pelo notebook."""
    with path.open("r", encoding="utf-8") as file:
        data = json.load(file)

    if isinstance(data, list):
        return [str(item) for item in data]

    if isinstance(data, dict):
        return [str(data[str(index)]) for index in range(len(data))]

    raise ValueError("class_names.json deve conter uma lista ou um dicionario.")


def load_trained_model(path: Path):
    """Importa TensorFlow apenas quando o app precisa carregar o modelo."""
    import tensorflow as tf

    return tf.keras.models.load_model(path)


def preprocess_image(image: Image.Image) -> np.ndarray:
    """Converte a imagem para RGB, redimensiona e normaliza pixels para 0-1."""
    image = image.convert("RGB").resize(IMAGE_SIZE)
    array = np.asarray(image, dtype=np.float32) / 255.0
    return np.expand_dims(array, axis=0)


def predict_top_k(model, class_names: list[str], image: Image.Image, k: int = 3) -> list[dict]:
    """Retorna as k classes mais provaveis para uma imagem."""
    batch = preprocess_image(image)
    probabilities = np.asarray(model.predict(batch, verbose=0))[0]

    k = min(k, len(class_names))
    top_indices = np.argsort(probabilities)[-k:][::-1]

    return [
        {
            "class_name": class_names[index],
            "confidence": float(probabilities[index]),
        }
        for index in top_indices
    ]

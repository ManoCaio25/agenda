from pathlib import Path

import pandas as pd
import streamlit as st
from PIL import Image

from app.inference import load_class_names, load_trained_model, predict_top_k


BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models" / "best_model.keras"
CLASS_NAMES_PATH = BASE_DIR / "models" / "class_names.json"


st.set_page_config(
    page_title="Doencas em Folhas de Plantas",
    page_icon="leaf",
    layout="centered",
)

st.title("Doencas em Folhas de Plantas")
st.warning(
    "Resultado experimental para fins academicos. Nao use esta predicao como diagnostico agricola definitivo."
)


@st.cache_resource
def get_resources():
    if not MODEL_PATH.exists():
        raise FileNotFoundError(f"Modelo nao encontrado: {MODEL_PATH}")
    if not CLASS_NAMES_PATH.exists():
        raise FileNotFoundError(f"Mapeamento de classes nao encontrado: {CLASS_NAMES_PATH}")

    model = load_trained_model(MODEL_PATH)
    class_names = load_class_names(CLASS_NAMES_PATH)
    return model, class_names


uploaded_file = st.file_uploader(
    "Envie uma imagem de folha",
    type=["jpg", "jpeg", "png", "webp"],
)

if uploaded_file is None:
    st.info("Treine o notebook e coloque `best_model.keras` e `class_names.json` em `models/`.")
    st.stop()

image = Image.open(uploaded_file)

left, right = st.columns([1, 1])
with left:
    st.image(image, caption="Imagem enviada", use_container_width=True)

try:
    model, class_names = get_resources()
except Exception as exc:
    st.error(str(exc))
    st.stop()

predictions = predict_top_k(model, class_names, image, k=3)
best_prediction = predictions[0]

with right:
    st.subheader("Predicao")
    st.metric(
        label="Classe mais provavel",
        value=best_prediction["class_name"],
    )
    st.progress(best_prediction["confidence"])
    st.write(f"Confianca: **{best_prediction['confidence']:.2%}**")

top3 = pd.DataFrame(
    {
        "Classe": [item["class_name"] for item in predictions],
        "Confianca": [f"{item['confidence']:.2%}" for item in predictions],
    }
)

st.subheader("Top 3 previsoes")
st.dataframe(top3, hide_index=True, use_container_width=True)

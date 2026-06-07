# Doencas em Folhas de Plantas

Projeto academico de Inteligencia Artificial para classificar imagens de folhas de plantas em classes de doenca ou folha saudavel.

O treinamento usa o dataset Plant Disease Recognition Dataset do Kaggle: https://www.kaggle.com/datasets/rashikrahmanpritom/plant-disease-recognition-dataset

## Estrutura

```text
.
├── app/
│   └── inference.py
├── app.py
├── data/
├── models/
├── notebook/
│   └── plant_disease_colab.ipynb
├── requirements.txt
└── README.md
```

## O que o notebook faz

- EDA das imagens: classes, imagens por classe, exemplos visuais, resolucao e desbalanceamento.
- Pre-processamento: resize para 224x224, normalizacao, treino/validacao/teste e data augmentation.
- Treino de dois modelos: CNN simples baseline e MobileNetV2 com Transfer Learning.
- Callbacks: EarlyStopping, ReduceLROnPlateau e ModelCheckpoint.
- Avaliacao: accuracy, F1-score macro, classification report, matriz de confusao e exemplos de acertos/erros.
- Exportacao de `models/best_model.keras` e `models/class_names.json`.

## Executar o notebook no Google Colab

1. Abra `notebook/plant_disease_colab.ipynb` no Google Colab.
2. No Kaggle, crie um token em `Account > API > Create New Token`.
3. Execute a celula de download e envie o arquivo `kaggle.json` quando solicitado.
4. Execute as celulas em ordem.
5. Ao final, mantenha ou copie estes arquivos para a pasta `models/` do projeto local:

```text
models/best_model.keras
models/class_names.json
```

As metricas serao calculadas durante a execucao. Este repositorio nao registra valores ficticios.

## Executar a interface local

Crie um ambiente virtual e instale as dependencias:

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

Com `best_model.keras` e `class_names.json` dentro de `models/`, rode:

```bash
streamlit run app.py
```

A interface permite upload de imagem, aplica o mesmo resize/normalizacao esperados pelo modelo, exibe a classe mais provavel, a confianca e o Top 3 de previsoes.

## Observacao importante

O resultado e experimental e serve para demonstracao academica. Ele nao substitui avaliacao tecnica de um especialista em agricultura ou fitopatologia.

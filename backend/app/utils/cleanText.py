import unicodedata
import re

def clean_text(text: str) -> str:
    text = unicodedata.normalize("NFKD", text)

    text = re.sub(
        r"(from:|to:|subject:|sent:|cc:).*?\n",
        "",
        text,
        flags=re.IGNORECASE
    )

    text = re.split(
        r"\n--\s*\n|\nAtenciosamente,|\nRegards,|\nObrigado,",
        text,
        maxsplit=1
    )[0]

    text = re.sub(r"http\S+|www\S+", "", text)

    text = re.sub(r"\n{2,}", "\n", text)
    text = re.sub(r"[ \t]{2,}", " ", text)

    # Remove caracteres estranhos
    text = re.sub(r"[^\w\s.,!?@%-]", "", text)

    return text.strip()
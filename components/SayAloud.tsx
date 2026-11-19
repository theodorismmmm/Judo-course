"use client";

export function speakAloud(reading: string, kanji?: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return false;
  const synth = window.speechSynthesis;
  const speak = () => {
    const voices = synth.getVoices();
    const japanese = voices.find((voice) => voice.lang.toLowerCase().startsWith("ja"));
    const useKanji = Boolean(japanese && kanji);
    const utter = new SpeechSynthesisUtterance(useKanji ? kanji : reading);
    utter.lang = useKanji ? "ja-JP" : "de-DE";
    utter.rate = useKanji ? 0.9 : 0.78;
    if (japanese && useKanji) utter.voice = japanese;
    synth.cancel();
    synth.speak(utter);
  };
  const voices = synth.getVoices();
  if (voices.length === 0) {
    synth.addEventListener("voiceschanged", speak, { once: true });
  } else {
    speak();
  }
  return true;
}

export function SayAloud({
  reading,
  kanji,
  label = "Anhören",
}: {
  reading: string;
  kanji?: string;
  label?: string;
}) {
  return (
    <button type="button" className="say" onClick={() => speakAloud(reading, kanji)}>
      {label}
    </button>
  );
}

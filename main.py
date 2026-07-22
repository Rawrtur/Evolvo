text = """{
  "questions": [
    {
      "question": "Was ist die Zielfunktion bei linearer Optimierung?",
      "answer": "Eine lineare Formel, deren Wert maximiert oder minimiert werden soll."
    },
    {
      "question": "Was bedeutet eine Nebenbedingung im Simplexverfahren?",
      "answer": "Eine lineare Einschränkung, die zulässige Werte der Variablen begrenzt."
    },
    {
      "question": "Warum werden Schlupfvariablen eingeführt?",
      "answer": "Sie wandeln Ungleichungen in Gleichungen um und messen ungenutzte Kapazität."
    },
    {
      "question": "Was ist eine Basisvariable im Simplextableau?",
      "answer": "Eine berechnete Variable mit Spalte: eine 1, sonst nur Nullen."
    },
    {
      "question": "Welche Rolle hat die Pivotspalte?",
      "answer": "Sie zeigt die eintretende Variable, meist den stärksten Verbesserungsbeitrag."
    },
    {
      "question": "Wie wird die Pivotzeile mittels Quotiententest bestimmt?",
      "answer": "Kleinster positiver Quotient, also Division: rechte Seite durch Pivotspaltenwert."
    },
    {
      "question": "Wann ist eine Simplexlösung optimal?",
      "answer": "Wenn in der Zielfunktionszeile keine negativen Verbesserungskoeffizienten mehr stehen."
    },
    {
      "question": "Woran erkennt man ein unbeschränktes Optimierungsproblem?",
      "answer": "Wenn kein positiver Pivotspaltenwert existiert, wächst die Zielfunktion unbegrenzt."
    },
    {
      "question": "Was bedeutet Degeneration im Simplexverfahren?",
      "answer": "Eine Basislösung ist degeneriert, wenn mindestens eine Basisvariable null ist."
    },
    {
      "question": "Wie hilft die Zwei-Phasen-Methode bei fehlender Startbasis?",
      "answer": "Sie findet zuerst mit künstlichen Variablen eine zulässige Anfangslösung."
    }
  ]
}"""

print(len(text))
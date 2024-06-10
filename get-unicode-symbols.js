const blocks = [
[0x0000, 0x007F], //; Basic Latin
[0x0080, 0x00FF], //; Latin-1 Supplement
[0x0100, 0x017F], //; Latin Extended-A
[0x0180, 0x024F], //; Latin Extended-B
[0x0250, 0x02AF], //; IPA Extensions
[0x0370, 0x03FF], //; Greek and Coptic
[0x0400, 0x04FF], //; Cyrillic
[0x0530, 0x058F], //; Armenian
[0x0590, 0x05FF], //; Hebrew
[0x0600, 0x06FF], //; Arabic
[0x0700, 0x074F], //; Syriac
[0x0780, 0x07BF], //; Thaana
[0x07C0, 0x07FF], //; NKo
[0x0800, 0x083F], //; Samaritan
[0x0840, 0x085F], //; Mandaic
[0x0900, 0x097F], //; Devanagari
[0x0980, 0x09FF], //; Bengali
[0x0A00, 0x0A7F], //; Gurmukhi
[0x0A80, 0x0AFF], //; Gujarati
[0x0B00, 0x0B7F], //; Oriya
[0x0B80, 0x0BFF], //; Tamil
[0x0C00, 0x0C7F], //; Telugu
[0x0C80, 0x0CFF], //; Kannada
[0x0D00, 0x0D7F], //; Malayalam
[0x0D80, 0x0DFF], //; Sinhala
[0x0E00, 0x0E7F], //; Thai
[0x0E80, 0x0EFF], //; Lao
[0x0F00, 0x0FFF], //; Tibetan
[0x1000, 0x109F], //; Myanmar
[0x10A0, 0x10FF], //; Georgian
[0x1200, 0x137F], //; Ethiopic
[0x13A0, 0x13FF], //; Cherokee
[0x1400, 0x167F], //; Unified Canadian Aboriginal Syllabics
[0x1680, 0x169F], //; Ogham
[0x16A0, 0x16FF], //; Runic
[0x1700, 0x171F], //; Tagalog
[0x1720, 0x173F], //; Hanunoo
[0x1740, 0x175F], //; Buhid
[0x1760, 0x177F], //; Tagbanwa
[0x1780, 0x17FF], //; Khmer
[0x1800, 0x18AF], //; Mongolian
[0x1900, 0x194F], //; Limbu
[0x1950, 0x197F], //; Tai Le
[0x1980, 0x19DF], //; New Tai Lue
[0x1A00, 0x1A1F], //; Buginese
[0x1A20, 0x1AAF], //; Tai Tham
[0x1B00, 0x1B7F], //; Balinese
[0x1B80, 0x1BBF], //; Sundanese
[0x1BC0, 0x1BFF], //; Batak
[0x1C00, 0x1C4F], //; Lepcha
[0x1C50, 0x1C7F], //; Ol Chiki
[0x2C00, 0x2C5F], //; Glagolitic
[0x2D30, 0x2D7F], //; Tifinagh
[0x3040, 0x309F], //; Hiragana
[0x30A0, 0x30FF], //; Katakana
[0x3100, 0x312F], //; Bopomofo
[0x3190, 0x319F], //; Kanbun
[0x4E00, 0x9FFF], //; CJK Unified Ideographs
[0xA000, 0xA48F], //; Yi Syllables
[0xA4D0, 0xA4FF], //; Lisu
[0xA500, 0xA63F], //; Vai
[0xA6A0, 0xA6FF], //; Bamum
[0xA800, 0xA82F], //; Syloti Nagri
[0xA840, 0xA87F], //; Phags-pa
[0xA880, 0xA8DF], //; Saurashtra
[0xA900, 0xA92F], //; Kayah Li
[0xA930, 0xA95F], //; Rejang
[0xA980, 0xA9DF], //; Javanese
[0xAA00, 0xAA5F], //; Cham
[0xAA80, 0xAADF], //; Tai Viet
[0xABC0, 0xABFF], //; Meetei Mayek
[0xAC00, 0xD7AF], //; Hangul Syllables
/*[0x10000, 0x1007F], //; Linear B Syllabary
[0x10080, 0x100FF], //; Linear B Ideograms
[0x10100, 0x1013F], //; Aegean Numbers
[0x10140, 0x1018F], //; Ancient Greek Numbers
[0x10190, 0x101CF], //; Ancient Symbols
[0x101D0, 0x101FF], //; Phaistos Disc
[0x10280, 0x1029F], //; Lycian
[0x102A0, 0x102DF], //; Carian
[0x102E0, 0x102FF], //; Coptic Epact Numbers
[0x10300, 0x1032F], //; Old Italic
[0x10330, 0x1034F], //; Gothic
[0x10350, 0x1037F], //; Old Permic
[0x10380, 0x1039F], //; Ugaritic
[0x103A0, 0x103DF], //; Old Persian
[0x10400, 0x1044F], //; Deseret
[0x10450, 0x1047F], //; Shavian
[0x10480, 0x104AF], //; Osmanya
[0x104B0, 0x104FF], //; Osage
[0x10500, 0x1052F], //; Elbasan
[0x10530, 0x1056F], //; Caucasian Albanian
[0x10570, 0x105BF], //; Vithkuqi
[0x10600, 0x1077F], //; Linear A
[0x10800, 0x1083F], //; Cypriot Syllabary
[0x10840, 0x1085F], //; Imperial Aramaic
[0x10860, 0x1087F], //; Palmyrene
[0x10880, 0x108AF], //; Nabataean
[0x108E0, 0x108FF], //; Hatran
[0x10900, 0x1091F], //; Phoenician
[0x10920, 0x1093F], //; Lydian
[0x10980, 0x1099F], //; Meroitic Hieroglyphs
[0x109A0, 0x109FF], //; Meroitic Cursive
[0x10A00, 0x10A5F], //; Kharoshthi
[0x10A60, 0x10A7F], //; Old South Arabian
[0x10A80, 0x10A9F], //; Old North Arabian
[0x10AC0, 0x10AFF], //; Manichaean
[0x10B00, 0x10B3F], //; Avestan
[0x10B40, 0x10B5F], //; Inscriptional Parthian
[0x10B60, 0x10B7F], //; Inscriptional Pahlavi
[0x10B80, 0x10BAF], //; Psalter Pahlavi
[0x10C00, 0x10C4F], //; Old Turkic
[0x10C80, 0x10CFF], //; Old Hungarian
[0x10D00, 0x10D3F], //; Hanifi Rohingya
[0x10E80, 0x10EBF], //; Yezidi
[0x10F00, 0x10F2F], //; Old Sogdian
[0x10F30, 0x10F6F], //; Sogdian
[0x10F70, 0x10FAF], //; Old Uyghur
[0x10FB0, 0x10FDF], //; Chorasmian
[0x10FE0, 0x10FFF], //; Elymaic
[0x11000, 0x1107F], //; Brahmi
[0x11080, 0x110CF], //; Kaithi
[0x110D0, 0x110FF], //; Sora Sompeng
[0x11100, 0x1114F], //; Chakma
[0x11150, 0x1117F], //; Mahajani
[0x11180, 0x111DF], //; Sharada
[0x11200, 0x1124F], //; Khojki
[0x11280, 0x112AF], //; Multani
[0x112B0, 0x112FF], //; Khudawadi
[0x11300, 0x1137F], //; Grantha
[0x11400, 0x1147F], //; Newa
[0x11480, 0x114DF], //; Tirhuta
[0x11580, 0x115FF], //; Siddham
[0x11600, 0x1165F], //; Modi
[0x11680, 0x116CF], //; Takri
[0x11700, 0x1174F], //; Ahom
[0x11800, 0x1184F], //; Dogra
[0x118A0, 0x118FF], //; Warang Citi
[0x11900, 0x1195F], //; Dives Akuru
[0x119A0, 0x119FF], //; Nandinagari
[0x11A00, 0x11A4F], //; Zanabazar Square
[0x11A50, 0x11AAF], //; Soyombo
[0x11AC0, 0x11AFF], //; Pau Cin Hau
[0x11C00, 0x11C6F], //; Bhaiksuki
[0x11C70, 0x11CBF], //; Marchen
[0x11D00, 0x11D5F], //; Masaram Gondi
[0x11D60, 0x11DAF], //; Gunjala Gondi
[0x11EE0, 0x11EFF], //; Makasar
[0x11F00, 0x11F5F], //; Kawi
[0x12000, 0x123FF], //; Cuneiform
[0x12480, 0x1254F], //; Early Dynastic Cuneiform
[0x12F90, 0x12FFF], //; Cypro-Minoan
[0x13000, 0x1342F], //; Egyptian Hieroglyphs
[0x14400, 0x1467F], //; Anatolian Hieroglyphs
[0x16A40, 0x16A6F], //; Mro
[0x16A70, 0x16ACF], //; Tangsa
[0x16AD0, 0x16AFF], //; Bassa Vah
[0x16B00, 0x16B8F], //; Pahawh Hmong
[0x16E40, 0x16E9F], //; Medefaidrin
[0x16F00, 0x16F9F], //; Miao
[0x17000, 0x187FF], //; Tangut
[0x18B00, 0x18CFF], //; Khitan Small Script
[0x1B170, 0x1B2FF], //; Nushu
[0x1BC00, 0x1BC9F], //; Duployan
[0x1E100, 0x1E14F], //; Nyiakeng Puachue Hmong
[0x1E290, 0x1E2BF], //; Toto
[0x1E2C0, 0x1E2FF], //; Wancho
[0x1E4D0, 0x1E4FF], //; Nag Mundari
[0x1E800, 0x1E8DF], //; Mende Kikakui
[0x1E900, 0x1E95F], //; Adlam*/
[0x1F600, 0x1F64F], //; Emoticons
];

function randomIntegerInRange(range) {
  return Math.trunc(Math.random() * (range[1]+1 - range[0]) + range[0]);
}

// function charIsSupported(v) {
//The first argument is the character you want to test, and the second argument is the font you want to test it in.
//If the second argument is left out, it defaults to the font of the <body> element.
//The third argument isn't used under normal circumstances, it's just used internally to avoid infinite recursion.
function characterIsSupported(character, font = getComputedStyle(document.body).fontFamily, recursion = false){
  //Create the canvases
  let testCanvas = document.createElement("canvas");
  let referenceCanvas = document.createElement("canvas");
  testCanvas.width = referenceCanvas.width = testCanvas.height = referenceCanvas.height = 150;

  //Render the characters
  let testContext = testCanvas.getContext("2d");
  let referenceContext = referenceCanvas.getContext("2d");
  testContext.font = referenceContext.font = "100px " + font;
  testContext.fillStyle = referenceContext.fillStyle = "black";
  testContext.fillText(character, 0, 100);
  referenceContext.fillText('\uffff', 0, 100);

  //Firefox renders unsupported characters by placing their character code inside the rectangle making each unsupported character look different.
  //As a workaround, in Firefox, we hide the inside of the character by placing a black rectangle on top of it.
  //The rectangle we use to hide the inside has an offset of 10px so it can still see part of the character, reducing the risk of false positives.
  //We check for Firefox and browers that behave similarly by checking if U+FFFE is supported, since U+FFFE is, just like U+FFFF, guaranteed not to be supported.
  if(!recursion && characterIsSupported('\ufffe', font, true)){
      testContext.fillStyle = referenceContext.fillStyle = "black";
      testContext.fillRect(10, 10, 80, 80);
      referenceContext.fillRect(10, 10, 80, 80);
  }

  //Check if the canvases are identical
  return testCanvas.toDataURL() != referenceCanvas.toDataURL();
}

export function getUnicodeExampleLetters() {
  let result = [];
  for(const block of blocks) {
    for(let i = 0; i < 10; i++) {
      let v = String.fromCodePoint(randomIntegerInRange(block));
      if(/\p{General_Category=Letter}/gu.test(v)) {
        if(characterIsSupported(v)) {
          result.push(v);
          break;
        }
      }
    }
  }
  return result;
}
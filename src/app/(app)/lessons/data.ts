// app/(app)/lessons/data.ts
export type VocabItem = {
  id: string;
  term: string; // 原文
  translation: string; // 譯文
  pos?: string; // 詞性
  exampleFrom?: string; // 原文例句
  exampleTo?: string; // 譯文例句
  tags?: string[];
};

export type Pack = {
  id: string;
  title: string;
  langFrom: string; // 例如 "JP"
  langTo: string; // 例如 "ZH"
  items: VocabItem[];
};

export const LANGUAGE_PACKS: Pack[] = [
  {
    id: 'jp-travel-basic',
    title: '日文：旅行基礎用語',
    langFrom: 'JP',
    langTo: 'ZH',
    items: [
      {
        id: '1',
        term: '駅はどこですか？',
        translation: '車站在哪裡？',
        exampleFrom: 'すみません、駅はどこですか？',
        exampleTo: '不好意思，請問車站在哪裡？',
        tags: ['問路', '基礎'],
      },
      {
        id: '2',
        term: 'いくらですか？',
        translation: '多少錢？',
        tags: ['購物', '金額'],
      },
      {
        id: '3',
        term: 'お願いします',
        translation: '拜託 / 麻煩你',
        tags: ['禮貌'],
      },
    ],
  },
  {
    id: 'en-daily-essentials',
    title: '英文：日常必備句',
    langFrom: 'EN',
    langTo: 'ZH',
    items: [
      {
        id: '1',
        term: 'Could you give me a hand?',
        translation: '可以幫我一下嗎？',
        tags: ['禮貌', '求助'],
      },
      {
        id: '2',
        term: 'I’m running late.',
        translation: '我快遲到了。',
        tags: ['時間'],
      },
      {
        id: '3',
        term: 'Sounds good to me.',
        translation: '聽起來不錯。',
        tags: ['回應'],
      },
    ],
  },
  {
    id: 'jp-n5-core',
    title: '日文：JLPT N5 核心字彙',
    langFrom: 'JP',
    langTo: 'ZH',
    items: [
      {
        id: '1',
        term: '食べる',
        translation: '吃',
        pos: '動詞',
        tags: ['動作'],
      },
      {
        id: '2',
        term: '大きい',
        translation: '大',
        pos: '形容詞',
        tags: ['描述'],
      },
      {
        id: '3',
        term: '学校',
        translation: '學校',
        pos: '名詞',
        tags: ['場所'],
      },
    ],
  },
];

// 方便 Server/RSC 使用的輔助函式（可選）
export async function listPacks() {
  return LANGUAGE_PACKS;
}

export async function getPack(id: string) {
  return LANGUAGE_PACKS.find((p) => p.id === id) ?? null;
}

import { expect, test } from 'vitest';
import { icchy } from './icchy';

test('hi icchy さんだと成功！', () => {
  // 左が期待値、右が実行結果
  // このテストは失敗する
  // hi: icchy さんだと成功！
  expect(icchy('icchy')).toBe('はーいいっちーさん');
});

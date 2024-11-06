import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { useEffect, useState } from "react";

const details = `
# Перун — Бог грому, блискавок і війни

## Основні функції та образ
Перун — головне божество грому, блискавок, війни та дощу. Вважався покровителем вогню та заліза, військової дружини і її очільника (князя). Його функції включають:

- **Керування природними стихіями**: блискавками, громами, дощем.
- **Військове заступництво**: опікунство над воїнами і війною, аналогічно римському Марсу та кельтському Таранісу.

## Історія та культурні паралелі
Перун має аналогічні функції з іншими індоєвропейськими богами громовержцями:

- **Грецький Зевс**
- **Римський Юпітер**
- **Германський Тор**
- **Індійський Індра**

### Міфічні паралелі та спорідненість
Існує гіпотеза, що Перун пов’язаний з давньогрецьким небесним титаном Гіперіоном. У міфах його весняною іпостассю може виступати Ярило.

## Символи та атрибути
Перуна зображають вершником або божеством на колісниці, що вражає ворога (змія або демона) блискавками або зброєю. Основні атрибути:

- **Зброя**: сокира, стріли, дубинка, пов’язана з видобуванням вогню.
- **Тварини та рослини**: орел, червоні та «вогняні» тварини (півень, телець, вепр), калина.
- **Перунові камені**: скам'янілі рештки белемнітів або фульгурити, народні назви блискавкових ударів.

## Народні звичаї та заборони
- Вважалося небезпечним ховатися під деревом або у воді під час грози, адже там ховається нечиста сила, і блискавка може вразити людину разом із нею.
- Дерево, в яке вдарила блискавка, не використовувалось для будівництва, а пожежу від блискавки не гасили.

## Вірування та іконографія
В Радзивіллівському літописі ідол Перуна зображений тричі як оголений чоловік зі щитом і жезлом. В описах німецьких мандрівників — як людина з кресалом у вигляді стріли чи променя. В Новгороді знайдено зображення Перуна як людини в довгій сорочці з вусами, що стоїть на стовпі.

## Цікаві факти та фразеологізми
- **Цар Горох** в українських казках, ймовірно, відображає образ Перуна, що карає за непослух.
- Казковий герой Котигорошко може мати зв’язок із Перуном.
- Народжені після споживання гороху чи перцю діти вважалися нащадками бога грози.
- **Фразеологізми**: «всипати перцю» (суворо покарати) та «з перцем» (запальна, гаряча на язик людина).

Таким чином, Перун символізував міць природи, вогонь, військову відвагу і справедливу караючість.
`;

type SerializeResult = MDXRemoteSerializeResult<
  Record<string, unknown>,
  Record<string, unknown>
>;

interface DetailsProps {
  mdxSource: SerializeResult;
}


export function Details({mdxSource}: DetailsProps) {
  return (
    <article className="prose dark:prose-invert prose-neutral prose-sm max-w-none">
      <MDXRemote {...mdxSource} />
    </article>
  );
}

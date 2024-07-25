# ENGLISH
[Inspired with markmap project](https://github.com/markmap/markmap). 
MMR (markdown mindmap react) is a simple Markdown mind map editor built with react (js + typescript). This project enables users to create, save, and load mind maps in convenient formats (txt, svg).
The project was created as a pet project for my own needs. I'm just learning React, so I'm not responsible for the quality of the code. If it is useful to someone, then I'm pleased.
## Functionality
- You can name a new mindmap or rename existing mindmap in top left card.
- To start, just type something in text area in markdown format.
- You have 4 buttons on the left side 1) add header 2) add node 3) add filled checkbox 4) add unfilled checkbox
- You can save your mindmap in two formats (*.txt, *.svg).
- Also you can load your previous mindmap saved in txt format to fast start.
## Customization
Checkout src/components/mindMap/markmap-hooks.tsx
- To change text area font color check const textareaFontColor = 'var(--green-color)';
- To change SVG font color check const svgFontColor = '#ffffff';
- To change SVG bg color check const svgBackgroundColor = '#282832';
For page customization check out src/components/mindMap/style.css
<a href="https://mindmap.nocturnal-app.ru" target="_blank">
    <img src="https://raw.githubusercontent.com/markdown_mindmap_react/markdown_mindmap_react/stable/src/assets/images/readme-header.png">
</a>



# Русский язык
[За основу был взят markmap](https://github.com/markmap/markmap).
MMR (markdown mindmap react) это простой Markdown редактор для создания интеллектуальных карт (mindmap) реализованный на react (js + typescript). Редактор позволяет создавать, редактировать, загружать и сохранять карты (в двух форматах: txt, svg).
Этот пет проект был создан для моих собственных нужд, т.к. мне нужен был простой, компактный и незамудренный инструмент для создания mindmap. Я больше по бэкенду, фронтенд только начинаю тыкать, поэтому за качество кода ручаться не могу. Но если кому-то будет полезно, я буду рад.
## Функциональность
- Слева сверху можно задать имя карты (или переименовать уже существующую)
- Чтобы начать работу просто введите что-то в текстовом поле в формате Markdown
- Добавил четыре простые кнопки: 1) Добавить заголовок 2) Добавить узел 3) Добавить пустой чек бокс 4) Добавить заполненный чек бокс
- Можно сохранить карту в двух форматах (txt, svg)
- Также можно загрузить предыдущую карту в формате txt
## Кастомизация
В src/components/mindMap/markmap-hooks.tsx
- Чтобы изменить цвет шрифта в текстовом поле см. const textareaFontColor = 'var(--green-color)';
- Чтобы изменить цвет шрифта в SVG файле, см. const svgFontColor = '#ffffff';
- Чтобы изменить цвет бэкграунда в SVG файле, см. const svgBackgroundColor = '#282832';
Для остальной кастомизации страницы, см. src/components/mindMap/style.css

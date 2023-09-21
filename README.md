# Тестовое задание

## Задачи

* Долевое строительство
* Кэш данных об облигациях
* Карточка облигации

## Структура проекта

```
src
├── app
│    ├── App.js              - основной компонент приложения
│    └── __snapshots__       - снэпшоты для тестов
├── features                 - папка с фичами
│    ├── bond-card 
│    │   ├── db              - indexedDB для хранения mock данных
│    │   ├── services        - redux api, slices
│    │   └── ui              - ui слой
│    │       ├── bond-card   - компонент карточки облигации
│    │       └── paginator 
│    ├── bonds-cache         - Кэш данных об облигациях
│    │   ├── services        - функция getBondsData ко второму заданию
│    │   └── ui              - интерфейс для работы с кэшем
│    └── shared-construction - Долевое строительство
├── utils                    - Вспомогательные утилиты
├── mocks                    - Моки внешнего API
│    └── handlers.js         - mock обработчики запросов
├── store.js                 - root redux store
└── index.js                 - bootstrup приложения

```

## Тесты

Тесты написаны для задачи "Долевое строительство". Для запуска тестов выполните команду:

### `npm test`

```
Shared counstruction
    convertToPercentageBigGenerator
        ✓ should correctly convert fractions to percentages
        ✓ should throw error for zero sum of fractions
        ✓ should throw error for non-string fractions
        ✓ should throw error for invalid number string
        ✓ should handle large numbers without loss of precision
    getArrayFromGenerator
        ✓ should convert generator to array
        ✓ should handle empty generators
```


## Долевое строительство

### `npm run examples:shares`

```
Shares: [ '1.5', '3', '6', '1.5' ]
Result: [ '12.500', '25.000', '50.000', '12.500' ]
```

### `npm run benchmark:shares`

```
Execution Time for 4 elements: 0.178ms
Execution Time for 10 elements: 0.026ms
Execution Time for 1000000 elements: 451.993ms
```

## Карточка облигации и Кэш данных об облигациях

### `npm start`

Запускает приложение. Откройте [http://localhost:3000](http://localhost:3000) чтобы увидеть результат.
Сразу после запуска желательно сгенерировать новый датасет,
чтобы графики выглядели более реалистично. 

![public/bond-card.mp4](public/bond-card.gif)

# API do Console

*Este é um trabalho em andamento e sujeito a alterações. Por favor, não confie nele para nada crítico* 

O `city-roads` fornece um conjunto adicional de operações para engenheiros de software, permitindo que eles executem consultas arbitrárias do OpenStreetMap e visualizem os resultados.

## Métodos

Esta seção descreve os métodos disponíveis na API do console.

### `scene.load()`

Permite que você carregue mais ruas de cidades na cena atual. Antes de mergulharmos nos detalhes, vamos explorar o que é necessário para renderizar Tóquio e Seattle lado a lado.

![Tokyo and Seattle](./images/tokyo_and_seattle.png)

Primeiro, abra a aplicação e carregue as ruas de `Seattle`. Em seguida, abra o [console do desenvolvedor](https://developers.google.com/web/tools/chrome-devtools/open) e execute o seguinte comando:

``` js
scene.load(Query.Road, 'Tokyo'); // carrega todas as ruas de Tóquio
```

Monitore sua aba `Networks` e veja quando a requisição for concluída. A caixa delimitadora de Tóquio é muito grande, então ela aparecerá muito longe no canto superior esquerdo. Vamos mover a grade de Tóquio para perto de Seattle:

``` js
// Encontre a camada carregada com Tóquio:
tokyo = scene.queryLayer('Tokyo');

// Os números exatos de deslocamento podem ser encontrados experimentando
tokyo.moveBy(/* xOffset = */ 718000, /* yOffset = */ 745000)
```

`scene.load()` tem a seguinte assinatura:

``` js
function load(wayFilter: String, loadOptions: LoadOptions);
```

* `wayFilter` é usado para filtrar caminhos do OpenStreetMap. Você pode encontrar uma lista de filtros conhecidos em `src/lib/Query.js`. Se você precisar saber mais para criar filtros personalizados, aqui está um [guia completo da linguagem](https://wiki.openstreetmap.org/wiki/Overpass_API/Overpass_QL). Você também pode obter uma boa visão da distribuição de chave/valor para caminhos explorando o [taginfo](https://taginfo.openstreetmap.org/tags) (certifique-se de ordenar por Ways em ordem decrescente para obter as combinações mais populares);
* `loadOptions` permite que você tenha controle granular sobre a caixa delimitadora dos resultados carregados. Se este valor for uma string, então ele é convertido para um ID de área geocodificado com nominatim, e então a primeira correspondência é usada como caixa delimitadora. Isso pode não ser suficiente às vezes, então você pode fornecer um ID de área específico, ou uma caixa delimitadora, passando um objeto. Por exemplo:

``` js
scene.load(Query.Road, {areaId: 3600237385}); // Define explicitamente o ID da área para Seattle

scene.load(Query.Building, { // Carrega todos os edifícios...
  bbox: [       // ...na caixa delimitadora fornecida
    "-15.8477", /* lat sul */ 
    "-47.9841", /* lon oeste */ 
    "-15.7330", /* lat norte */ 
    "-47.7970"  /* lon leste */ 
  ]});
```

### scene.queryLayerAll()

Retorna todas as camadas adicionadas à cena. Isto é o que é necessário para atribuir cores diferentes a cada camada:

``` js
allLayers = scene.queryLayerAll()
allLayers[0].color = 'deepskyblue'; // a cor pode ser um nome.
allLayers[1].color = 'rgb(255, 12, 43)'; // ou qualquer outra expressão (rgb, hex, hsl, etc.)
```

### `scene.clear()`

Limpa a cena atual, permitindo que você comece do zero.


### `scene.saveToPNG(fileName: string)`

Para salvar a cena atual como um arquivo PNG, execute

``` js
scene.saveToPNG('hello'); // hello.png é salvo
```

### `scene.saveToSVG(fileName: string, options?: Object)`

Este comando permite que você salve a cena como um arquivo SVG.

``` js
scene.saveToSVG('hello'); // hello.svg é salvo
```

Se você está planejando usar um pen-plotter ou um cortador a laser, você também pode reduzir muito o tempo de impressão, removendo caminhos muito curtos da exportação final. Para fazer isso, passe a opção `minLength`:

``` js
scene.saveToSVG('hello', {minLength: 2}); 
// Todos os caminhos com comprimento menor que 2px são removidos do SVG final.
```

## Exemplos

Aqui estão alguns exemplos de trabalho com a API.

### Carregando todas as ciclovias na cidade atual

``` js
var bikes = scene.load('way[highway="cycleway"]', {layer: scene.queryLayer()})
// Torna as linhas com 4 pixels de largura
bikes.lineWidth = 4
// e vermelhas
bikes.color = 'red'
```

### Carregando todas as rotas de ônibus na cidade atual

Este script obterá todas as rotas de ônibus na cidade atual e as renderizará com 4px de largura, com cor vermelha:

``` js
var areaId = scene.queryLayer().getQueryBounds().areaId;
var bus = scene.load('', {
  layer: scene.queryLayer(),
  raw: `[out:json][timeout:250];
area(${areaId});(._; )->.area;
(nwr[route=bus](area.area););
out body;>;out skel qt;`
});

bus.color='red';
bus.lineWidth = 4;
```

Se você quiser um número de ônibus específico, passe `ref=bus_number` adicional. Por exemplo, rota de ônibus #24:

``` js
var areaId = scene.queryLayer().getQueryBounds().areaId;
var bus = scene.load('', {
  layer: scene.queryLayer(),
  raw: `[out:json][timeout:250];
area(${areaId});(._; )->.area;
(nwr[route=bus][ref=24](area.area););
out body;>;out skel qt;`
});

bus.color = 'green';
bus.lineWidth = 4;
```



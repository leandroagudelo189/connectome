/* global saveAs */
/* global _F */

(function() {
  'use strict';

  var app = angular.module('lrSpaApp');

  app
    .config(function(snapRemoteProvider) {
      snapRemoteProvider.globalOptions = {
        //disable: 'right',
        maxPosition: 350,
        tapToClose: false,
        touchToDrag: true
      };
    });

  app
    .controller('MainCtrl', function ($scope, $rootScope, $log, $state, debounce, localStorageService, ligandReceptorData, graphService) {

      $scope.state = $state.current.name;

      $scope.go = function(name) {
        $scope.state = name;
        $state.go(name);
      };

      /* Manage panel state */
      localStorageService.bind($scope, 'panelState', {
        nodeFilters: true,
        edgeFilters: true,
        options: false,
        help: true,
        download: true
      });

      localStorageService.bind($scope, 'options', {
        showLabels: true,
        maxEdges: 100,
        ligandFilter: 10,
        receptorFilter: 10,
        ligandRankFilter: 0.1,
        receptorRankFilter: 0.1,
        edgeRankFilter: 1,
      });

      var graph = graphService;  // TODO:  don't need this??

      /* network */
      graph.clear();
      $scope.graph = graphService;
      $scope.graphData = graph.data;

      /* Save */
      $scope.saveJson = function() {  // TODO: a service?
        var txt = graph.getJSON();
        var blob = new Blob([txt], { type: 'data:text/json' });
        saveAs(blob, 'lr-graph.json');
      };

      $scope.saveGml = function() {  // TODO: a service?
        var txt = graph.getGML();
        var blob = new Blob([txt], { type: 'data:text/gml' });
        saveAs(blob, 'lr-graph.gml');
      };

      /* Load Data */
      //$scope.selected = {
      //  pairs: [],
      //  cells: []
      //};

      $scope.selectedIds = {
        pairs: [],
        cells: []
      };

      var _id = _F('id');
      //var _index = _F('$index');



      function loadSelection() {

        function _ticked(arr) {
          return function(d) {
            d.ticked = arr.indexOf(d.id) > -1;
            return d.ticked;
          };
        }

        $log.debug('load from local storage');

        localStorageService.bind($scope, 'selectedIds', {
          pairs: [374],
          cells: [72,73],
          genes: []
        });

        $scope.data.pairs.forEach(_ticked($scope.selectedIds.pairs));
        $scope.data.cells.forEach(_ticked($scope.selectedIds.cells));
        $scope.data.genes.forEach(_ticked($scope.selectedIds.genes));

        //$scope.selected.pairs = $scope.data.pairs.filter(_ticked($scope.selectedIds.pairs));
        //$scope.selected.cells = $scope.data.cells.filter(_ticked($scope.selectedIds.cells));
        //$scope.selected.genes = $scope.data.genes.filter(_ticked($scope.selectedIds.genes));

      }

      $scope.max = Math.max;

      function updateSampleExpression() {  // Todo: move
        //if (cells === old) { return; }

        console.log('update expression');

        $scope.data.cells.forEach(function(cell) {  // TODO: move this, should only run when new cell is selected
          if (!cell.ticked) {return;}
          //return;

          if (cell.expr) { return; }
          //if (!$scope.data.genes[0].$$hashKey) { return; }

          //if (cell.expr && $scope.data.genes[0].$$hashKey) {
          //  return;
          //}

          //console.log($scope.data.genes[0].$$hashKey);

          cell.expr = [];
          cell._genes = [];

          $log.debug('getting all gene expression for '+cell.name);

          $scope.data.genes.forEach(function(gene) {
            var v = +$scope.data.expr[gene.id + 1][cell.id + 1];
            if (v > 0) {
              cell.expr.push({
                //gene: gene,
                id: gene.id,
                type: gene._type,
                value: v
              });
            }
          });

          cell.expr.sort(function(a,b) { return b.value - a.value; });

          cell.ligands = cell.expr.filter(_F('type').eq('ligand'));       // store filtered lists for later
          cell.receptors = cell.expr.filter(_F('type').eq('receptor'));

          //console.log(cell.expr, cell.ligands);

        });
      }

      /* function crossReferencePairs(pairs) {  // Todo: move, optimize

        pairs.forEach(function(pair) {
          $scope.data.genes.forEach(function(gene) {
            if (gene.name == pair.Ligand) {
              gene._type = 'ligand';
              pair._ligand = gene;
            }
            if (gene.name == pair.Receptor) {
              gene._type = 'receptor';
              pair._receptor = gene;
            }
          })
        });

      } */

      /* function updateGenes(genes) {  // Todo: move, optimize
        $scope.selected.genes.forEach(function(gene) {
          if (gene.ticked !== true) {return;}
          var _genes = [];
          gene._type = 'ligand';  // needed because some genes are not either, fix

          $scope.data.pairs.forEach(function(pair) {
            //console.log(pair);
            if (pair.Ligand == gene.name) {
              gene._type = 'ligand';
              _genes.push(pair._receptor.id);
            }
            if (pair.Receptor == gene.name) {
              gene._type = 'receptor';
              _genes.push(pair._ligand.id);
            }
          });

          gene.geneIds = _genes;

        })
      } */

      var updateNetwork = function updateNetwork() {  // This should be handeled by the directive
        $log.debug('update network');

        //console.log($scope.selected.genes);
        //if (newVal === oldVal) {return;}
        //if (angular.equals(newVal, oldVal)) {return;}
        graph.makeNetwork($scope.data, $scope.options);
        graph.draw($scope.options);
      };

      /* function saveSelectionIds(key) {
        return function(newVal, oldVal) {

          console.log('changed',key);

          var oldIds = $scope.selectedIds[key];
          var newIds = $scope.selected[key].map(_id);

          //if (!angular.equals(oldIds, newIds)) {
            console.log('new ids');
            $scope.selectedIds[key] = newIds;
          //}
        }
      } */

      var _ticked = _F('ticked');

      function saveSelectionIds(key) {
        return function(newVal) {
          //return;
          if ($scope.graphData.hoverEvent) {
            graph.update();
            $scope.graphData.hoverEvent = false;
          }

          //console.log('changed',key);

          //graph.update();

          var newIds = newVal.filter(_ticked).map(_id);

          if (!angular.equals(newIds, $scope.selectedIds[key])) {
            console.log('new ids', key);
            $scope.selectedIds[key] = newIds;
            updateNetwork(newIds,$scope.selectedIds);
          } else {
            graph.update();
          }

        };
      }

      ligandReceptorData.load().then(function() {

        $scope.data = ligandReceptorData.data;

        //crossReferencePairs($scope.data.pairs);

        //$scope.data.genes.forEach(function(g) {
          //console.log(g);
        //})

        loadSelection();

        if (true) {   // lazy load
          //updateGenes();
          updateSampleExpression();

          $scope.$watch('selectedIds.cells', updateSampleExpression);
          //$scope.$watch('selectedIds.genes', updateGenes);
        } else {
          //updateGenes($scope.data.genes);
          updateSampleExpression($scope.data.cells);
        }

        updateNetwork(true,false);

        $scope.$watch('data.cells', saveSelectionIds('cells'),true);
        $scope.$watch('data.pairs', saveSelectionIds('pairs'),true);
        $scope.$watch('data.genes', saveSelectionIds('genes'),true);

        //$scope.$watch('selected.pairs', saveSelectionIds('pairs'));
        //$scope.$watch('selected.cells', saveSelectionIds('cells'));
        //$scope.$watch('selected.genes', saveSelectionIds('genes'));

        $scope.$watchCollection('selectedIds.pairs', updateNetwork);
        $scope.$watchCollection('selectedIds.cells', updateNetwork);
        $scope.$watchCollection('selectedIds.genes', updateNetwork);

        $scope.$watch('options.ligandFilter', updateNetwork);
        $scope.$watch('options.receptorFilter', updateNetwork);
        $scope.$watch('options.ligandRankFilter', updateNetwork);
        $scope.$watch('options.receptorRankFilter', updateNetwork);

        $scope.$watch('options.edgeRankFilter', updateNetwork); // TODO: filter in place
        $scope.$watch('options.showLabels', function() {
          graph.draw($scope.options);
        });

      });

      //$scope.test = function() {
      //  console.log($scope.data.genes[417]);
      //}

    });

  app
  .filter('percentage', ['$filter', function($filter) {
      return function(input, decimals) {
          return $filter('number')(input*100, decimals)+'%';
        };
    }]);

  app
  .filter('min', function() {
    return function(input) {
      var out;
      if (input) {
        for (var i in input) {
          if (input[i] < out || out === undefined || out === null) {
            out = input[i];
          }
        }
      }
      return out;
    };
  });

  app
  .filter('max', function() {
      return function(input) {
        var out;
        if (input) {
          for (var i in input) {
            if (input[i] > out || out === undefined || out === null) {
              out = input[i];
            }
          }
        }
        return out;
      };
    }
  );

  app
  .directive('graphItem', function() {
    return {
      scope: {
        item: '=graphItem',
        data: '='
      },
      templateUrl: 'components/ui/item.html',
      link: function() {

      }
    };
  });

  app
  .directive('expressionList', function() {
    return {
      scope: {
        list: '=expressionList',
        array: '=',
        key: '&'
      },
      templateUrl: 'components/ui/gene-list-template.html',
      link: function (scope, element, attrs) {
        scope.limit = 3;

        attrs.key = attrs.key || 'gene';  // todo: change

        scope.get = function(_) {
          var __ = _[attrs.key];

          if (typeof __ === 'number' && attrs.array) {  // this is an id
            return scope.array[__];
          } else {
            return __;
          }
        };

        scope.hover = function(item, __) {
          if (item.ticked) {
            item.hover = __;
          }
        };

        scope.click = function(item) {
          item.ticked = !item.ticked;
        };

        scope.expand = function() {
          scope.limit = (scope.limit + 10 < scope.list.length) ? scope.limit + 10 : scope.list.length;
        };

      }
    };
  });

})();

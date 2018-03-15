(function () {
  'use strict';

  angular
    .module('pb.ds.retention')
    .controller('RetentionController', function ($log,
                                                 $uibModal,
                                                 $http,
                                                 $scope,
                                                 $interval, $timeout) {
      var _this = this;

      _this.colors = [
        '#3e53a4',
        '#cf0989',
        '#009bdf',
        '#ef8200',
        '#edb700',
        '#a03f9b',
        '#00b140',
        '#0072b8'
      ];
      _this.mono = [
        '#00436E',
        '#005A93',
        '#0072B8',
        '#66AAD4',
        '#CCE3F1',
        '#E5F1F8'
      ];

      _this.commonFilter = {};
      _this.monthToExpiry = {
        labels: ['3M', '6M', '12M', '18M'],
        colors: ['rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)'],
        data: [
          []
        ],
        options: {
          plugins: {
            datalabels: {
              color: 'white',
              font: {
                weight: 'bold'
              },
              anchor: 'end',
              align: 'start',
              offset: 10,
              display: function (context) {
                return context.dataset.data[context.dataIndex] >= 10000; // or >= 1 or ...
              }
            }
          },
          scales: {
            xAxes: [{
              barPercentage: 0.4,
              gridLines: {
                display: false
              }
            }],
            yAxes: [{
              ticks: {
                beginAtZero: true,
                stepSize: 10000
              },
              gridLines: {
                display: false
              }
            }]
          }
        }
      };
      _this.meterType = {
        labels: ['BOL', 'MOL', 'TOL C+', 'TOL Mega'],
        colors: ['rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)',
          'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)'],
        data: [[]],
        options: {
          plugins: {
            datalabels: {
              color: 'white',
              font: {
                weight: 'bold'
              },
              anchor: 'end',
              align: 'start',
              offset: 10,
              display: function (context) {
                return context.dataset.data[context.dataIndex] >= 10000; // or >= 1 or ...
              }
            }
          },
          scales: {
            xAxes: [{
              stacked: false,
              beginAtZero: true,
              ticks: {
                stepSize: 1,
                min: 0,
                autoSkip: false
              },
              gridLines: {
                display: false
              }
            }],
            yAxes: [{
              ticks: {
                beginAtZero: true,
                stepSize: 10000
              },
              gridLines: {
                display: false
              }
            }]
          }
        }
      };
      _this.customeGroup = {
        labels: ['Commercial', 'Government', 'Strategic'],
        colors: ['rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)',
          'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)'],
        data: [[]],
        options: {
          plugins: {
            datalabels: {
              color: 'white',
              font: {
                weight: 'bold'
              },
              display: function (context) {
                return context.dataset.data[context.dataIndex] >= 10000; // or >= 1 or ...
              },
              anchor: 'end',
              align: 'start',
              offset: 10
            }
          },
          scales: {
            xAxes: [{
              stacked: false,
              beginAtZero: true,
              ticks: {
                stepSize: 1,
                min: 0,
                autoSkip: false
              },
              gridLines: {
                display: false
              }
            }],
            yAxes: [{
              ticks: {
                beginAtZero: true,
                stepSize: 10000
              },
              gridLines: {
                display: false
              }
            }]
          }
        }
      };
      _this.cancellation = {
        labels: ['0 - 20', '21 - 40', '41 - 60', '61 - 80', '81 - 100', 'Not Predicted'],
        colors: ['rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)',
          'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)'],
        data: [[]],
        options: {
          plugins: {
            datalabels: {
              color: 'white',
              font: {
                weight: 'bold'
              },
              anchor: 'end',
              align: 'start',
              offset: 10,
              display: function (context) {
                return context.dataset.data[context.dataIndex] >= 10000; // or >= 1 or ...
              }
            }
          },
          scales: {
            xAxes: [{
              barPercentage: 0.4,
              stacked: false,
              beginAtZero: true,
              ticks: {
                stepSize: 1,
                min: 0,
                autoSkip: false
              },
              gridLines: {
                display: false
              }
            }],

            yAxes: [{
              ticks: {
                beginAtZero: true,
                stepSize: 10000
              },
              gridLines: {
                display: false
              }
            }]
          }
        }
      };
      _this.activityStatus = {
        labels: ['Active', 'Sleep', 'Na'],
        colors: ['rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)',
          'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)'],
        data: [[]],
        options: {
          plugins: {
            datalabels: {
              color: 'white',
              font: {
                weight: 'bold'
              },
              anchor: 'end',
              align: 'start',
              offset: 10,
              display: function (context) {
                return context.dataset.data[context.dataIndex] >= 10000; // or >= 1 or ...
              }
            }
          },
          scales: {
            xAxes: [{
              barPercentage: 0.4,
              stacked: false,
              beginAtZero: true,
              ticks: {
                stepSize: 1,
                min: 0,
                autoSkip: false
              },
              gridLines: {
                display: false
              }
            }],
            yAxes: [{
              ticks: {
                beginAtZero: true,
                stepSize: 10000
              },
              gridLines: {
                display: false
              }
            }]
          }
        }
      }
      _this.digitalIndex = {
        labels: ['High', 'Medium', 'Low'],
        colors: ['rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)',
          'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)'],
        data: [[]],
        options: {
          plugins: {
            datalabels: {
              color: 'white',
              font: {
                weight: 'bold'
              },
              anchor: 'end',
              align: 'start',
              offset: 10,
              display: function (context) {
                return context.dataset.data[context.dataIndex] >= 10000; // or >= 1 or ...
              }
            }
          },
          scales: {
            xAxes: [{
              stacked: false,
              beginAtZero: true,
              ticks: {
                stepSize: 1,
                min: 0,
                autoSkip: false
              },
              barPercentage: 0.4,
              gridLines: {
                display: false
              }
            }],
            yAxes: [{
              ticks: {
                beginAtZero: true,
                stepSize: 10000
              },
              gridLines: {
                display: false
              }
            }]
          }
        }
      };


      _this.selectedBarIndex = {
        'lease_expiry': -1,
        'type': -1,
        'status': -1,
        'probability': -1,
        'd_category': -1,
        'c_group': -1
      };

      _this.resetFilters = function () {
        _this.commonFilter = {};
        _this.selectedBarIndex = {
          'lease_expiry': -1,
          'type': -1,
          'status': -1,
          'probability': -1,
          'd_category': -1,
          'c_group': -1
        };
        _this.getDataAsPerCurrentFilters();
      };

      _this.onClick = function (points, elements) {
        if (points.length > 0) {
          var obj = {};
          obj[points[0]._chart.canvas.id] = points[0]._model.label
          angular.extend(_this.commonFilter, obj);
          _this.getDataAsPerCurrentFilters(points[0]._chart.canvas.id, points[0]['$datalabels']._index);
        }
      };

      _this.getFilter = function (id) {
        if (id) {
          var filter = {
            current: id,
            commonFilter: angular.extend({}, _this.commonFilter)
          };
          delete filter.commonFilter[id];
          return filter;
        } else {
          return {commonFilter: angular.extend({}, _this.commonFilter)};
        }
      };

      _this.getDataAsPerCurrentFilters = function (id, index) {
        if (id !== 'lease_expiry') {
          $http.post('https://lookalike-service-temp-dot-datatest-148118.appspot.com/activeLeases',
            angular.extend({}, _this.getFilter('lease_expiry'), {current: 'lease_expiry'})).then(
            function (response) {
              if (response.data) {
                // var labels = [];
                var values = [0, 0, 0, 0];
                for (var key in response.data) {
                  values[_this.monthToExpiry.labels.indexOf(key)] = response.data[key];
                }
                _this.monthToExpiry.data = values;
                // logic for changing ticks and labels
                var max = Math.max.apply(null, values);
                var maxAsStr = '' + max;
                var cal = Math.pow(10, (maxAsStr.length - 1));
                _this.monthToExpiry.options.scales.yAxes[0].ticks.stepSize = cal;
                _this.monthToExpiry.options.plugins.datalabels.display = function (context) {
                  return context.dataset.data[context.dataIndex] >= cal;
                }

                _this.monthToExpiry.colors = ['rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)',
                  'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)'];
                if (_this.selectedBarIndex['lease_expiry'] != -1) {
                  _this.monthToExpiry.colors[_this.selectedBarIndex['lease_expiry']] = "rgb(62,83,164,1)";
                }
              }
            }, function (error) {
            });
        } else if (id === 'lease_expiry' && index > -1) {
          $timeout(function () {
            _this.selectedBarIndex[id] = index;
            _this.monthToExpiry.colors = ['rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)',
              'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)'];
            _this.monthToExpiry.colors[index] = "rgb(62,83,164,1)";
          });
        }

        if (id !== 'probability') {
          $http.post('https://lookalike-service-temp-dot-datatest-148118.appspot.com/activeLeases',
            angular.extend({}, _this.getFilter('probability'), {current: 'probability'})).then(
            function (response) {
              if (response.data) {
                var values = [];
                for (var key in response.data) {
                  values[_this.cancellation.labels.indexOf(key)] = response.data[key];
                }
                _this.cancellation.data = values;

                // logic for changing ticks and labels
                var max = Math.max.apply(null, values);
                var maxAsStr = '' + max;
                var cal = Math.pow(10, (maxAsStr.length - 1));
                _this.cancellation.options.scales.yAxes[0].ticks.stepSize = cal;
                _this.cancellation.options.plugins.datalabels.display = function (context) {
                  return context.dataset.data[context.dataIndex] >= cal;
                }

                _this.cancellation.colors = ['rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)',
                  'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)'];
                if (_this.selectedBarIndex['probability'] != -1) {
                  _this.cancellation.colors[_this.selectedBarIndex['probability']] = "rgb(62,83,164,1)";
                }
              }
            }, function (error) {
            });
        } else if (id === 'probability' && index > -1) {
          $timeout(function () {
            _this.selectedBarIndex[id] = index;
            _this.cancellation.colors = ['rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)',
              'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)'];
            _this.cancellation.colors[index] = "rgb(62,83,164,1)";
          });
        }

        if (id !== 'status') {
          $http.post('https://lookalike-service-temp-dot-datatest-148118.appspot.com/activeLeases',
            angular.extend({}, _this.getFilter('status'), {current: 'status'})).then(
            function (response) {
              if (response.data) {
                var labels = [];
                var values = [];
                for (var key in response.data) {
                  labels.push(key);
                  values.push(response.data[key]);
                }
                _this.activityStatus.data = values;

                // logic for changing ticks and labels
                var max = Math.max.apply(null, values);
                var maxAsStr = '' + max;
                var cal = Math.pow(10, (maxAsStr.length - 1));
                _this.activityStatus.options.scales.yAxes[0].ticks.stepSize = cal;
                _this.activityStatus.options.plugins.datalabels.display = function (context) {
                  return context.dataset.data[context.dataIndex] >= cal;
                }

                _this.activityStatus.labels = labels;
                _this.activityStatus.colors = ['rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)',
                  'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)'];
                if (_this.selectedBarIndex['status'] != -1) {
                  _this.activityStatus.colors[_this.selectedBarIndex['status']] = "rgb(62,83,164,1)";
                }
              }
            }, function (error) {
            });
        } else if (id === 'status' && index > -1) {
          $timeout(function () {
            _this.selectedBarIndex[id] = index;
            _this.activityStatus.colors = ['rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)',
              'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)'];
            _this.activityStatus.colors[index] = "rgb(62,83,164,1)";
          });
        }

        if (id !== 'd_category') {

          $http.post('https://lookalike-service-temp-dot-datatest-148118.appspot.com/activeLeases',
            angular.extend({}, _this.getFilter('d_category'), {current: 'd_category'})).then(
            function (response) {
              if (response.data) {
                var labels = [];
                var values = [];
                for (var key in response.data) {
                  labels.push(key);
                  values.push(response.data[key]);
                }
                _this.digitalIndex.data = values;
                // logic for changing ticks and labels
                var max = Math.max.apply(null, values);
                var maxAsStr = '' + max;
                var cal = Math.pow(10, (maxAsStr.length - 1));
                _this.digitalIndex.options.scales.yAxes[0].ticks.stepSize = cal;
                _this.digitalIndex.options.plugins.datalabels.display = function (context) {
                  return context.dataset.data[context.dataIndex] >= cal;
                }
                _this.digitalIndex.labels = labels;
                _this.digitalIndex.colors = ['rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)',
                  'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)'];
                if (_this.selectedBarIndex['d_category'] != -1) {
                  _this.digitalIndex.colors[_this.selectedBarIndex['d_category']] = "rgb(62,83,164,1)";
                }
              }
            }, function (error) {
            });
        } else if (id === 'd_category' && index > -1) {
          $timeout(function () {
            _this.selectedBarIndex[id] = index;
            _this.digitalIndex.colors = ['rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)',
              'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)'];
            _this.digitalIndex.colors[index] = "rgb(62,83,164,1)";
          });
        }

        if (id !== 'type') {
          $http.post('https://lookalike-service-temp-dot-datatest-148118.appspot.com/activeLeases',
            angular.extend({}, _this.getFilter('type'), {current: 'type'})).then(
            function (response) {
              if (response.data) {
                var values = [0, 0, 0, 0];
                for (var key in response.data) {
                  values[_this.meterType.labels.indexOf(key)] = response.data[key];
                }
                _this.meterType.data = values;
                // logic for changing ticks and labels
                var max = Math.max.apply(null, values);
                var maxAsStr = '' + max;
                var cal = Math.pow(10, (maxAsStr.length - 1));
                _this.meterType.options.scales.yAxes[0].ticks.stepSize = cal;
                _this.meterType.options.plugins.datalabels.display = function (context) {
                  return context.dataset.data[context.dataIndex] >= cal;
                }
                _this.meterType.colors = ['rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)',
                  'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)'];
                if (_this.selectedBarIndex['type'] != -1) {
                  _this.meterType.colors[_this.selectedBarIndex['type']] = "rgb(62,83,164,1)";
                }
              }
            }, function (error) {
            });
        } else if (id === 'type' && index > -1) {
          $timeout(function () {
            _this.selectedBarIndex[id] = index;
            _this.meterType.colors = ['rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)',
              'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)'];
            _this.meterType.colors[index] = "rgb(62,83,164,1)";
          });
        }

        if (id !== 'c_group') {
          $http.post('https://lookalike-service-temp-dot-datatest-148118.appspot.com/activeLeases',
            angular.extend({}, _this.getFilter('c_group'), {current: 'c_group'})).then(
            function (response) {
              if (response.data) {
                var labels = [];
                var values = [];
                for (var key in response.data) {
                  labels.push(key);
                  values.push(response.data[key]);
                }
                _this.customeGroup.data = values;
                _this.customeGroup.labels = labels;

                // logic for changing ticks and labels
                var max = Math.max.apply(null, values);
                var maxAsStr = '' + max;
                var cal = Math.pow(10, (maxAsStr.length - 1));
                _this.customeGroup.options.scales.yAxes[0].ticks.stepSize = cal;
                _this.customeGroup.options.plugins.datalabels.display = function (context) {
                  return context.dataset.data[context.dataIndex] >= cal;
                };

                _this.customeGroup.colors = ['rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)',
                  'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)'];
                if (_this.selectedBarIndex['c_group'] != -1) {
                  _this.customeGroup.colors[_this.selectedBarIndex['c_group']] = "rgb(62,83,164,1)";
                }
              }
            }, function (error) {
            });
        } else if (id === 'c_group' && index > -1) {
          $timeout(function () {
            _this.selectedBarIndex[id] = index;
            _this.customeGroup.colors = ['rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)',
              'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)', 'rgb(62,83,164,0.5)'];
            _this.customeGroup.colors[index] = "rgb(62,83,164,1)";
          });
        }

        // total leases
        $http.post('https://lookalike-service-temp-dot-datatest-148118.appspot.com/totalLeases', _this.getFilter()).then(function (response) {
          _this.totalLeases = response.data.count;
        });
      }
      _this.getDataAsPerCurrentFilters();
    });
})();


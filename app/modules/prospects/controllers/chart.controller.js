(function () {
  'use strict';

  angular
    .module('pb.ds.prospects')
    .controller('ChartController', function ($log,
                                             $uibModalInstance,
                                             itemResolve) {
      var _this = this;

      _this.item = itemResolve;

      _this.close = function () {
        $uibModalInstance.dismiss();
      };

      $log.debug(_this.item);
    });
})();

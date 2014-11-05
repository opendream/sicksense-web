;(function ($, window, document, undefined) {

  var url = API_BASEPATH + '/news';
  var processing = false;

  app.controller('NewsController', ['$scope', '$http', 'shared', function($scope, $http, shared) {

    /**
     * Items to display.
     */
    $scope.items = [];

    $scope.resetForm = function() {
      $scope.title = '';
      $scope.content = '';
    };

    /**
     * Load items.
     */
    $scope.loadItems = function() {
      if (processing) return false;

      processing = true;

      var params = { token: shared.token, limit: 2000 };

      $http.get(url, {
        params: params
      })
        .success(function (resp) {
          $scope.removeItems();

          resp.response.news.items.forEach(function (newsItem) {
            $scope.items.push(newsItem);
          });

          processing = false;
        })
        .error(function (resp) {
          if (resp.error) {
            alert('Error: ' + resp.error);
          }
          else {
            alert('Error: ' + resp.meta.errorMessage);
          }
          processing = false;
        });
    };

    $scope.removeItems = function() {
      $scope.items = [];
    };

    /**
     * Add new item.
     */
    $scope.addItem = function() {
      if (processing) return false;

      processing = true;
      $scope.disableButtons();

      var data = {
        title: $scope.title.trim(),
        content: $scope.content.trim()
      };
      var params = { token: shared.token };

      $http.post(url, data, {
        params: params
      })
        .success(function (resp) {
          $scope.items.unshift(resp.response);
          $scope.cancelModal('#add-new');
        })
        .error(function (resp) {
          if (resp.error) {
            alert('Error: ' + resp.error);
          }
          else {
            alert('Error: ' + resp.meta.errorMessage);
          }
          $scope.enableButtons();
        });
    };

    /**
     * Show confirm delete dialog.
     */
    $scope.showConfirmDeleteDialog = function() {
      $scope.current = this.item;
      $('#confirm-delete').foundation('reveal', 'open');
    };

    /**
     * Show news form dialog.
     */
    $scope.showNewsFormDialog = function() {
      $scope.isEdit = true;
      $scope.current = this.item;
      $scope.title = $scope.current.title;
      $scope.content = $scope.current.content;

      $('#add-new').foundation('reveal', 'open');
    };

    /**
     * Edit item.
     */
    $scope.editItem = function () {
      if (processing) return false;

      processing = true;
      $scope.disableButtons();

      var editURL = url + '/' + $scope.current.id;
      var data = {
        title: $scope.title.trim(),
        content: $scope.content.trim()
      };
      var params = { token: shared.token };
      $http.post(editURL, data, {
        params: params
      })
        .success(function (resp) {
          var index = $scope.items.indexOf($scope.current);
          $scope.items.splice(index, 1);
          $scope.items.unshift(resp.response);          

          $scope.closeModal('#add-new');
        })
        .error(function (resp) {
          if (resp.error) {
            alert('Error: ' + resp.error);
          }
          else {
            alert('Error: ' + resp.meta.errorMessage);
          }
          $scope.enableButtons();
        });
    };

    /**
     * Delete item.
     */
    $scope.deleteItem = function() {
      if (processing) return false;

      processing = true;
      $scope.disableButtons();

      var deleteURL = url + '/' + $scope.current.id;
      var params = { token: shared.token };
      $http.delete(deleteURL, {
        params: params
      })
        .success(function (resp) {
          var index = $scope.items.indexOf($scope.current);
          if (index > -1) {
            $scope.items.splice(index, 1);
          }
          $scope.closeModal('#confirm-delete');
        })
        .error(function (resp) {
          if (resp.error) {
            alert('Error: ' + resp.error);
          }
          else {
            alert('Error: ' + resp.meta.errorMessage);
          }
          $scope.enableButtons();
        });

    };

    /**
     * Cancel button action.
     */
    $scope.cancelModal = function(selector) {
      $scope.closeModal(selector);
      $scope.enableButtons();
      $scope.resetForm();
    };

    /**
     * Enable all buttons.
     */
    $scope.enableButtons = function() {
      $('#add-item-button').prop('disabled', false);
      $('#edit-item-button').prop('disabled', false);
      $('#add-cancel-button').prop('disabled', false);
      $('#delete-item-button').prop('disabled', false);
      $('#delete-cancel-button').prop('disabled', false);
      $('#add-item-button').removeClass('disabled');
      $('#edit-item-button').removeClass('disabled');
      $('#add-cancel-button').removeClass('disabled');
      $('#delete-item-button').removeClass('disabled');
      $('#delete-cancel-button').removeClass('disabled');
      processing = false;
    };

    /**
     * Disable all buttons.
     */
    $scope.disableButtons = function() {
      $('#add-item-button').prop('disabled', true);
      $('#edit-item-button').prop('disabled', true);
      $('#add-cancel-button').prop('disabled', true);
      $('#delete-item-button').prop('disabled', true);
      $('#delete-cancel-button').prop('disabled', true);
      $('#add-item-button').addClass('disabled');
      $('#edit-item-button').addClass('disabled');
      $('#add-cancel-button').addClass('disabled');
      $('#delete-item-button').addClass('disabled');
      $('#delete-cancel-button').addClass('disabled');
    };

    /**
     * Close reveal modal by CSS selector.
     */
    $scope.closeModal = function(selector) {
      $(selector).foundation('reveal', 'close');
      processing = false;
      $scope.enableButtons();
    };

    /**
     * Return date formatted.
     */
    $scope.getDateFormatted = function(date) {
      if (date) {
        return moment(date).format('D MMM YYYY - HH:mm:ss');
      }
      return '';
    };

    /**
     * Initialize app.
     */
    $scope.init = function() {
      // Set default values to add form.
      $scope.resetForm();

      $scope.$on('tokenChanged', function () {
        $scope.loadItems();
      });
    };

    // Start
    $scope.init();

  }]);

  $(document).foundation();

})(jQuery, this, this.document);

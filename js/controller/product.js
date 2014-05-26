function ProductCtrl($scope, $rootScope)
{

	$scope.onClickForAddNew = function()
	{
		$scope.is_add_new = true;
		$rootScope.menus = [{name:"BACK", path:"/products", icon:"fa-arrow-left", click:function(){
			$scope.is_add_new = false;
			$rootScope.menus = [{name:"Add New", path:"/products", icon:"fa-plus", click:$scope.onClickForAddNew }, {name:"Import", path:"/stock/import", icon:"fa-download"}];
		} }, {name:"Save", path:"/products", icon:"fa-plus", click:$scope.onClickForSave }];	
	}

	$scope.onClickForSave = function()
	{
		$scope.addItem($scope.newItem);
		$scope.is_add_new = false;

		$rootScope.menus = [{name:"Add New", path:"/products", icon:"fa-plus", click:$scope.onClickForAddNew }];
		if($scope.store.is_use_stock)
			$rootScope.menus.push({name:"Import", path:"/stock/import", icon:"fa-download"});
	}

	$rootScope.menus = [{name:"Add New", path:"/products/create", icon:"fa-plus"}];
	if($scope.store.is_use_stock)
		$rootScope.menus.push({name:"Import", path:"/stock/import", icon:"fa-download"});
	$scope.is_add_new = false;
	$scope.setCRUDforItem = function(item)
	{
		item.isEdit = false;
		item.save = function()
		{
			this.isEdit = false;
			LocalProduct.update(this, function(){
				$scope.refresh();
			})
		}
		item.delete = function()
		{
			if(confirm("Are you sure to delete this product?"))
				LocalProduct.delete(this, function(){
					$scope.refresh();
				})
		}
		return angular.copy(item);
	}

	/*
	* Init Zone
	*/
	//$rootScope.loadProducts();
	
	$scope.refresh = function()
	{
		$scope.items = LocalProduct.query();
		for(var i =0; i < $scope.items.length; i++)
		{
			$scope.items[i] = $scope.setCRUDforItem($scope.items[i]);
		}
	}
	$scope.refresh();

	$scope.addItem = function(item)
	{
		item.initStock = 0;
		item.currentStock =0;
		LocalProduct.create(item, function(){
			$scope.refresh();
		});
		$scope.is_add_new = false;
	}
}

function ProductCreateCtrl($scope, $rootScope, $location)
{
	$scope.onClickForSave = function()
	{
		$scope.addItem($scope.newItem);
	}

	$rootScope.menus = [{name:"BACK", path:"/products", icon:"fa-arrow-left" }, {name:"Save", path:"/products/create", icon:"fa-plus", click:$scope.onClickForSave }];	

	$scope.addItem = function(item)
	{
		item.initStock = 0;
		item.currentStock =0;
		LocalProduct.create(item, function(){
			$location.path('/products');
		});
	}

	$scope.takePhoto = function()
	{
		if(confirm("Are you sure we gonna take photo"))
			navigator.camera.getPicture(function(){
				$scope.$apply($scope.successPhoto)
			}, function(){
				$scope.$apply($scope.failPhoto)
			}, { quality: 40,
	    	destinationType: Camera.DestinationType.FILE_URI });
	}

	newItem.img_src = ""
	newItem.have_photo = false;
	$scope.successPhoto = function(imageURI)
	{
		newItem.img_src = imageURI;
		newItem.have_photo = true;
	}

	$scope.failPhoto = function(message)
	{
		alert('Failed because: ' + message);
	}
}
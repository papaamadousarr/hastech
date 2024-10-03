<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('pages.welcome');
});

Route::get('/home/create', function () {
    return view('adds.create');
});

Route::post('/insert', 'CreateAdd@insert') ;
Route::post('/update{add_id}', 'CreateAdd@update') ;


Route::get('/getall', 'CreateAdd@getData') ;
Route::get('/home/myadds', 'CreateAdd@getUserAdds') ;
Route::get('/home/profile', 'CreateAdd@getProfile') ;


 

Route::get('/editadd{addid}', ['uses' =>'CreateAdd@editAdd']);
   

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');

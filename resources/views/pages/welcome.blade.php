@extends('main')
@section('content')
<div class="row">
            <div class="col-md-12">
                <div class="jumbotron">
                    <h1>Welcome to the GarageLK</h1>
                    <p>Sri Lanka's biggest online marketplace for auto Spare Parts</p>
                <a href="/getall">All Adds</a>
                </div>
            </div>
        </div>


<?php if(DB::connection()->getDatabaseName())
   {
     echo "connected successfully to database ".DB::connection()->getDatabaseName();
   }
?>

         
<!-- form serch-->
<div  class="col-md-10 col-md-offset-2"  id="form_wrap"><!-- search container-->
<div class="col-md-4 ">


<div class="col-md-1" id="or" >
<h1 align="center"></h1></div>
<!-- form serch-->
<div class="col-md-4 " id="quicksearch">
<form id="quick_search">


  <div class="form-group">
      <center><label for="part">Part:</label>
    <input type="text" class="form-control" id="partD" placeholder="What are you looking?"></center>
    
  </div>
  
  
  
  <button type="submit" class="btn btn-primary center-block">Search</button>
</form>
</div>
<!--end form-->
</div><!--end of Search container-->
<!--
<div class="row" id="login_label">
            <div class="col-md-12">
                <div align="center" >
                    <h4>Want Sell Your Spare Parts?</h4>
                    <p>
                          <a href="#"><em>Create Account</em></a><br>
                          <a href="#"><em>LOG IN</em></a>
                    </p>
               
                </div>
            </div>
        </div>-->


    @endsection
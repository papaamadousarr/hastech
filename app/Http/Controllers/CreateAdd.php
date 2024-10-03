<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Add;
use Session;
use DB;
use Auth;

class CreateAdd extends Controller
{
  function insert(Request $request){
      $this->validate($request, array(
        'title'=>'required|max:255',
        'description'=>'required',
        'location'=>'required',
        'price'=>'required',
        'contact'=>'required',
        'condition'=>'required',
            
        ));
        //store in the DB
       $add = new Add;
      $auth = new Auth;

         $add ->u_id =  Auth::user()->id;
        $add ->title = $request->title; 
        $add ->description = $request->description; 
        $add ->location = $request->location; 
        $add ->price = $request->price; 
        $add ->contact = $request->contact; 
        $add ->condition = $request->condition; 
   
      
      
        
        $add->save();
        Session::flash('success','The add is successfully uploaded for review');
        return view('adds.success');
      
  }  //
    
    
      function getData(){
     
          $data['data'] = DB::table('adds')->get();
         
          if(count($data)>0){
              
              return view('adds.show',$data);
          }
          else
          {
              return view('adds.show');
          }
      
  }
    
    
        
      function getUserAdds(){
     
          $data['data'] = DB::table('adds')->where('u_id', '=', Auth::user()->id)->get();
         
          if(count($data)>0){
              
              return view('adds.useradds',$data);
          }
          else
          {
              return view('adds.useradds');
          }
      
  }
    
          function getProfile(){
     
          $data['data'] = DB::table('users')->where('id', '=', Auth::user()->id)->get();
         
          if(count($data)>0){
              
              return view('adds.userprofile',$data);
          }
          else
          {
              return view('adds.userprofile');
          }
      
  }
    
    
    public function editAdd($id){
     
         $editAddId = Add::where('add_id',$id)->first();
        return view('adds.edit',['editAddId'=>$editAddId]);
  }
    

    
     public function update(Request $request, $id){

          $this->validate($request, array(
        'title'=>'required|max:255',
        'description'=>'required',
        'location'=>'required',
        'price'=>'required',
        'contact'=>'required',
        'condition'=>'required',
            
        ));
         
          $editAdd =Add::find($id);
         
        
        $editAdd ->title = $request->input('title'); 
        $editAdd ->description = $request->input('description');
        $editAdd ->location = $request->input('location'); 
        $editAdd ->price = $request->input('price'); 
        $editAdd ->contact = $request->input('contact'); 
        $editAdd ->condition = $request->input('condition'); 
         $editAdd->save();
   
      
  }  //
    
    

}

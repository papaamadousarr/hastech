    @extends('main')
    @section('content')
<center>


   
   
    @foreach($data as $value)
        <div class="col-md-8">
        <h5 align=left><b>Title</b></h5>
            <p>{{$value->title}}</p>
            
            <h5 align=left><b>Description</b></h5>
            <p>{{$value->description}}</p>
            
            <h5 align=left><b>Location</b></h5>
            <p>{{$value->location}}</p>
        <hr>
        </div>
        
     
         @endforeach
   
   
</center>
    
@endsection
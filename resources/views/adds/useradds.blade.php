
@extends('main')
    @section('content')
<center>


    <table>
    <tr>
        <td>Title</td>
        <td>Description</td>
        <td>Location</td>
        
        </tr>
    @foreach($data as $value)
      
        <tr>
        <td>{{$value->title}}</td>
        <td>{{$value->description}}</td>
        <td>{{$value->location}}</td>
            <td><a href="{{url('/editadd'.$value->add_id) }}">Edit</a></td>
             <td><a href="">Delete</a></td>

        </tr>
         @endforeach
    </table>
   
</center>
    
@endsection
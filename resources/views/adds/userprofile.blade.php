    @extends('main')
    @section('content')
<center>


    <table>
    <tr>
        <td>Name</td>
        <td>Email</td>


        </tr>
    @foreach($data as $value)

        <tr>
        <td>{{$value->name}}</td>
        <td>{{$value->email}}</td>


        </tr>
         @endforeach
    </table>
   
</center>
    
@endsection
    @extends('main')
    @section('content')

    <div class="row">
            <div class="col-md-12" id="contact_data">
                <h1>Edit Add</h1>

                
                
{{Form::open(array("url"=>"/update".$editAddId->add_id, 'files'=>true))}}
         
   
                {{Form::label('title','Title:')}}
       {{Form::text('title', $editAddId->title, array('class'=>'form-control'))}}
                
                {{Form::label('description','Description:')}}
       {{Form::textarea('description', $editAddId->description, array('class'=>'form-control'))}}
                
                  {{Form::label('location','Location:')}}
       {{Form::text('location', $editAddId->location, array('class'=>'form-control','id'=>'txtPlaces'))}}
                
                  {{Form::label('price','Price:')}}
       {{Form::text('price', $editAddId->price, array('class'=>'form-control'))}}
                
                  {{Form::label('contact','Contact:')}}
       {{Form::text('contact', $editAddId->contact, array('class'=>'form-control'))}}
                
                  {{Form::label('condition','Condition:')}}
       {{Form::text('condition', $editAddId->condition, array('class'=>'form-control'))}}
               <br> 
                {{Form::submit('Edit Add', array('class'=>'btn btn-success btn-lg btn-block'))}}
                
               {!! Form::close() !!}
                
                
                
                
                
                
            <script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?sensor=false&libraries=places&region=lk"></script>
<script type="text/javascript">
    google.maps.event.addDomListener(window, 'load', function () {
        var places = new google.maps.places.Autocomplete(document.getElementById('txtPlaces'));
        google.maps.event.addListener(places, 'place_changed', function () {

        });
    });
</script>


                
                

            </div>
        </div>
@endsection
<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAddsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
         Schema::create('adds', function (Blueprint $table) {
            $table->increments('add_id');
            $table->string('u_id')->nullable();
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->string('location')->nullable();
            $table->string('price')->nullable();
            $table->string('contact')->nullable();
            $table->string('category')->nullable();
            $table->string('condition')->nullable();
            $table->string('promo')->nullable();
            $table->string('live')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('adds');
    }
}

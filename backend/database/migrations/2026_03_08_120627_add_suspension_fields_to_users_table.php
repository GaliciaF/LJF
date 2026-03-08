<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('suspension_reason')->nullable()->after('status');
            $table->dateTime('suspended_until')->nullable()->after('suspension_reason');
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['suspension_reason', 'suspended_until']);
        });
    }
};
'use strict';
var Timer = function () {
	this.workTime   = 25;
	this.shortBreak = 5;
	this.longBreak  = 15;
	this.current    = 0;
	this.interval   = null;
	this.remianing  = 0;
};

Timer.prototype.init = function() {
	// var source   = $("#timer-template").html();
	// this.template = Handlebars.compile(source);
};

Timer.prototype.startTimer = function() {
	var self = this;
	// self.updateTimer();

	if (!self.interval) {
		self.interval = setInterval(function() {
			self.current += 1;
			self.updateTimer();
		}, 1000);
	}
};

Timer.prototype.updateTimer = function() {
	this.remaining = this.workTime * 60 - this.current;
	var minutes = Math.floor(this.remaining / 60);
	var seconds = this.remaining - minutes * 60;
	this.remainingStr = "" + minutes + ":" + seconds;
	var context = { timer: this };
	$('.timer-main').html(this.template(context));
};

var TimeBlock = function (block_type, time, work) {
	this.block_type = block_type;
	this.time = time;
	this.work = work;
};

var ProgressBlock = function () {
	this.time_blocks = [];
}

ProgressBlock.prototype.createTimeBlocks = function (timer) {
	this.time_blocks.push(new TimeBlock("work", timer.workTime, true));
	this.time_blocks.push(new TimeBlock("short-break", timer.shortBreak, false));
	this.time_blocks.push(new TimeBlock("work", timer.workTime, true));
	this.time_blocks.push(new TimeBlock("short-break", timer.shortBreak, false));
	this.time_blocks.push(new TimeBlock("work", timer.workTime, true));
	this.time_blocks.push(new TimeBlock("short-break", timer.shortBreak, false));
	this.time_blocks.push(new TimeBlock("work", timer.workTime, true));
	this.time_blocks.push(new TimeBlock("long-break", timer.longBreak, false));
}


$().ready(function() {
	window.timer = new Timer();
	window.timer.init();

	var prgoress_source = $("#progress-template").html();
	var progress_template = Handlebars.compile(prgoress_source);

	var pb = new ProgressBlock();
	pb.createTimeBlocks(window.timer);

	var context = { blocks: pb.time_blocks };
	$('.hitstory').html(progress_template(context));


	$('.timer-main').click(function() {
		window.timer.startTimer();
	});
	$(".open-page").click(function(el) {
		var page = $(this).attr("data-page");
		$(".page-" + page).slideDown();
	});
	$(".exit-page").click(function() {
  		$(this).parent("div").slideUp();
	});
	$(".work-block-edit").click(function() {
  		$("div.tracking-notes").slideDown();
	});
});
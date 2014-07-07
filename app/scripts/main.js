'use strict';
var Zucchini = function () {
	this.workTime   = 23;
	this.shortBreak = 5;
	this.longBreak  = 15;
	this.display = $(".timer-inner .clock");

	this.timer = new Timer();

	var prgoress_source = $("#progress-template").html();
	this.progress_template = Handlebars.compile(prgoress_source);

	this.progress_blocks = [];

	var pb = new ProgressBlock();
	pb.createTimeBlocks(this);

	this.progress_blocks.push(pb);
	this.queueNextBlock();
}

Zucchini.prototype.getProgressBlock = function () {
	return this.progress_blocks[0];
};

Zucchini.prototype.queueNextBlock = function () {
	var block = this.getProgressBlock().getNextBlock();
	$(".timer-inner .cta").html("Start " + _.str.titleize(_.str.humanize(block.block_type)));

	this.timer.setTimer(this.getProgressBlock().getNextBlock());
	this.updateClock();
};

Zucchini.prototype.startNextBlock = function () {
	return this.timer.startTimer();
};

Zucchini.prototype.updateClock = function () {
	var minutes = Math.floor(this.timer.remaining / 60);
	var seconds = this.timer.remaining - minutes * 60;
	minutes = ("0" + minutes).slice(-2);
	seconds = ("0" + seconds).slice(-2);
	this.timer.remainingStr = "" + minutes + ":" + seconds;
	this.display.html(this.timer.remainingStr);
};

var Timer = function () {
	this.interval   = null;
	this.remianing  = 0;
};

Timer.prototype.setTimer = function (block) {
	this.block = block;
	this.remaining = this.block.time * 60;
}

Timer.prototype.startTimer = function () {
	var self = this;
	
	$(".timer-inner").addClass("active");

	self.updateTimer();

	if (!self.interval) {
		self.interval = setInterval(function() {
			if (self.remaining <= 0) {
				self.stopTimer();
				return;
			}
			self.remaining -= 1;
			self.updateTimer();
		}, 1000);
	}
};

Timer.prototype.updateTimer = function() {
	window.app.updateClock();

	var progress = ((this.block.time * 60) - this.remaining) * 100 / (this.block.time * 60);
	this.block.progress = Math.floor(progress);
	window.app.progress_blocks[0].render();
};

Timer.prototype.stopTimer = function() {
	clearInterval(this.interval);
	this.interval = null;
	$(".timer-inner").removeClass("active");
	window.app.queueNextBlock();
}

var TimeBlock = function (block_type, time, work) {
	this.block_type = block_type;
	this.time = time;
	this.work = work;
	this.progress = 0;
};

var ProgressBlock = function () {
	this.time_blocks = [];
	this.current = 0;
}

ProgressBlock.prototype.createTimeBlocks = function (app) {
	this.time_blocks.push(new TimeBlock("work", app.workTime, true));
	this.time_blocks.push(new TimeBlock("short-break", app.shortBreak, false));
	this.time_blocks.push(new TimeBlock("work", app.workTime, true));
	this.time_blocks.push(new TimeBlock("short-break", app.shortBreak, false));
	this.time_blocks.push(new TimeBlock("work", app.workTime, true));
	this.time_blocks.push(new TimeBlock("short-break", app.shortBreak, false));
	this.time_blocks.push(new TimeBlock("work", app.workTime, true));
	this.time_blocks.push(new TimeBlock("long-break", app.longBreak, false));
}

ProgressBlock.prototype.render = function () {
	var context = { blocks: this.time_blocks };
	$('.hitstory').html(window.app.progress_template(context));
}

ProgressBlock.prototype.getNextBlock = function () {
	if (this.time_blocks[this.current].progress >= 100) {
		if (this.current < this.time_blocks.length) {
			this.current += 1;
		} else {
			this.current = 0;
		}
	}
	return this.time_blocks[this.current];
}


$().ready(function() {
	window.app = new Zucchini();

	window.app.progress_blocks[0].render();


	$('.countdown').click(function() {
		window.app.startNextBlock();
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


$(document).ready(function($) {
    $('#accordion').find('.accordion-toggle').click(function(){

      //Expand or collapse this panel
      $(this).next().slideToggle('fast');

      //Hide the other panels
      // $(".accordion-content").not($(this).next()).slideUp('fast');

    });
  });
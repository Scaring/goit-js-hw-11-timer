// Create Countdown
const CountdownTimer = {
  // Backbone-like structure
  selector: $('.countdown'),

  // Params
  countdown_interval: null,
  total_seconds: 0,
  currentTime: Date.now(),
  targetDate: new Date('Feb 25, 2020'),
  time() {
    return this.targetDate - this.currentTime;
  },

  // Initialize the countdown
  init() {
    // DOM
    this.$ = {
      days: this.selector.find('.bloc-time.days .figure'),
      hours: this.selector.find('.bloc-time.hours .figure'),
      minutes: this.selector.find('.bloc-time.min .figure'),
      seconds: this.selector.find('.bloc-time.sec .figure'),
    };

    // Init countdown values
    this.values = {
      days: Math.floor(this.time() / (1000 * 60 * 60 * 24)),
      hours: Math.floor(
        (this.time() % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      ),
      minutes: Math.floor((this.time() % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((this.time() % (1000 * 60)) / 1000),
    };

    // Initialize total seconds
    this.total_seconds =
      this.values.days * 24 * 60 * 60 +
      this.values.hours * 60 * 60 +
      this.values.minutes * 60 +
      this.values.seconds;

    // Animate countdown to the end
    this.count();
  },

  count() {
    const that = this,
      $day_1 = this.$.days.eq(0),
      $day_2 = this.$.days.eq(1),
      $hour_1 = this.$.hours.eq(0),
      $hour_2 = this.$.hours.eq(1),
      $min_1 = this.$.minutes.eq(0),
      $min_2 = this.$.minutes.eq(1),
      $sec_1 = this.$.seconds.eq(0),
      $sec_2 = this.$.seconds.eq(1);

    this.countdown_interval = setInterval(() => {
      if (that.total_seconds > 0) {
        --that.values.seconds;

        if (that.values.minutes >= 0 && that.values.seconds < 0) {
          that.values.seconds = 59;
          --that.values.minutes;
        }

        if (that.values.hours >= 0 && that.values.minutes < 0) {
          that.values.minutes = 59;
          --that.values.hours;
        }

        if (that.values.days >= 0 && that.values.hours < 0) {
          that.values.hours = 24;
          --that.values.days;
        }
        // Update DOM values
        // Days
        that.checkHour(that.values.days, $day_1, $day_2);

        // Hours
        that.checkHour(that.values.hours, $hour_1, $hour_2);

        // Minutes
        that.checkHour(that.values.minutes, $min_1, $min_2);

        // Seconds
        that.checkHour(that.values.seconds, $sec_1, $sec_2);

        --that.total_seconds;
      } else {
        clearInterval(that.countdown_interval);
      }
    }, 1000);
  },

  animateFigure($el, value) {
    const that = this,
      $top = $el.find('.top'),
      $bottom = $el.find('.bottom'),
      $back_top = $el.find('.top-back'),
      $back_bottom = $el.find('.bottom-back');

    // Before we begin, change the back value
    $back_top.find('span').html(value);

    // Also change the back bottom value
    $back_bottom.find('span').html(value);

    // Then animate
    TweenMax.to($top, 0.8, {
      rotationX: '-180deg',
      transformPerspective: 300,
      ease: Quart.easeOut,
      onComplete() {
        $top.html(value);

        $bottom.html(value);

        TweenMax.set($top, { rotationX: 0 });
      },
    });

    TweenMax.to($back_top, 0.8, {
      rotationX: 0,
      transformPerspective: 300,
      ease: Quart.easeOut,
      clearProps: 'all',
    });
  },

  checkHour(value, $el_1, $el_2) {
    const val_1 = value.toString().charAt(0),
      val_2 = value.toString().charAt(1),
      fig_1_value = $el_1.find('.top').html(),
      fig_2_value = $el_2.find('.top').html();

    if (value >= 10) {
      // Animate only if the figure has changed
      if (fig_1_value !== val_1) this.animateFigure($el_1, val_1);
      if (fig_2_value !== val_2) this.animateFigure($el_2, val_2);
    } else {
      // If we are under 10, replace first figure with 0
      if (fig_1_value !== '0') this.animateFigure($el_1, 0);
      if (fig_2_value !== val_1) this.animateFigure($el_2, val_1);
    }
  },
};

// Let's go !
CountdownTimer.init();

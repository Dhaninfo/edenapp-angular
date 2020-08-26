import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
declare var $: any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  wpUrl = environment.wpUrl
  constructor() { }

  ngOnInit() {
    $(document).ready(function () {
      // Custom function which toggles between sticky class (is-sticky)
      $(document).ready(function () {
        $('.dropdown').hover(
          function () {
            $(this).children('.sub-menu').slideDown(200);
          },
          function () {
            $(this).children('.sub-menu').slideUp(200);
          }
        );
      }); // end read
      var stickyToggle = function (sticky, stickyWrapper, scrollElement) {
        var stickyHeight = sticky.outerHeight();
        var stickyTop = stickyWrapper.offset().top;
        if (scrollElement.scrollTop() >= stickyTop) {
          stickyWrapper.height(stickyHeight);
          sticky.addClass("is-sticky");
        }
        else {
          sticky.removeClass("is-sticky");
          stickyWrapper.height('auto');
        }
      };

      // Find all data-toggle="sticky-onscroll" elements
      $('[data-toggle="sticky-onscroll"]').each(function () {
        var sticky = $(this);
        var stickyWrapper = $('<div>').addClass('sticky-wrapper'); // insert hidden element to maintain actual top offset on page
        sticky.before(stickyWrapper);
        sticky.addClass('sticky');

        // Scroll & resize events
        $(window).on('scroll.sticky-onscroll resize.sticky-onscroll', function () {
          stickyToggle(sticky, stickyWrapper, $(this));
        });

        // On page load
        stickyToggle(sticky, stickyWrapper, $(window));
      });
    });
  }

}

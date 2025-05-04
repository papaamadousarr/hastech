import { Component, OnInit  , CUSTOM_ELEMENTS_SCHEMA, AfterViewInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { register } from 'swiper/element/bundle';


register();


@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SliderComponent implements AfterViewInit {
  private platformId = inject(PLATFORM_ID);

  ngAfterViewInit() {
    // Only run this code in the browser
    if (isPlatformBrowser(this.platformId)) {
      const swiperEl: any = document.querySelector('swiper-container');
      if (swiperEl) {
        const swiperParams = {
          slidesPerView: 1,
          spaceBetween: 0,
          navigation: true,
          pagination: {
            clickable: true, 
            el: '.swiper-pagination',
          },
          autoplay: {
            delay: 5000,
            disableOnInteraction: false
          },
          loop: true,
        };

        Object.assign(swiperEl, swiperParams);
        swiperEl.initialize();
      }
    }
  }
}
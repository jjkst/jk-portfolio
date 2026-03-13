import { Component, Input, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { NgFor, NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-image-carousel',
  standalone: true,
  imports: [NgFor, NgClass, NgIf],
  templateUrl: './image-carousel.component.html',
  styleUrl: './image-carousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageCarouselComponent {
  @Input() images: string[] = [];
  @Input() alt = '';

  currentIndex = 0;
  lightboxOpen = false;

  get hasMultiple(): boolean {
    return this.images.length > 1;
  }

  prev(): void {
    this.currentIndex = this.currentIndex === 0
      ? this.images.length - 1
      : this.currentIndex - 1;
  }

  next(): void {
    this.currentIndex = this.currentIndex === this.images.length - 1
      ? 0
      : this.currentIndex + 1;
  }

  goTo(index: number): void {
    this.currentIndex = index;
  }

  openLightbox(): void {
    this.lightboxOpen = true;
  }

  closeLightbox(): void {
    this.lightboxOpen = false;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
    if (!this.hasMultiple && !this.lightboxOpen) return;

    if (event.key === 'ArrowLeft') {
      this.prev();
    } else if (event.key === 'ArrowRight') {
      this.next();
    } else if (event.key === 'Escape' && this.lightboxOpen) {
      this.closeLightbox();
    }
  }
}

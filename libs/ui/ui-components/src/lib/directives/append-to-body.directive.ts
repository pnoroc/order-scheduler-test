import { Directive, ElementRef, OnInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appAppendToBody]',
  standalone: true,
})
export class AppendToBodyDirective implements OnInit, OnDestroy {
  private parentElement!: HTMLElement;

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    const menuElement = this.elementRef.nativeElement as HTMLElement;
    this.parentElement = menuElement.parentElement!;

    // Get the exact coordinates of the three-dots button container
    const rect = this.parentElement.getBoundingClientRect();

    // Position the dropdown absolutely relative to the window viewport coordinates
    menuElement.style.position = 'fixed';
    menuElement.style.top = `${rect.bottom + window.scrollY + 4}px`;
    menuElement.style.left = `${rect.right + window.scrollX - 180}px`; // Aligns right edge (180px width)
    menuElement.style.width = '180px';

    // Move the menu node to the body to break free of parent layout overflows
    document.body.appendChild(menuElement);
  }

  ngOnDestroy(): void {
    const menuElement = this.elementRef.nativeElement as HTMLElement;
    if (menuElement && menuElement.parentNode === document.body) {
      document.body.removeChild(menuElement);
    }
  }
}

import { AfterViewInit, Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-turnstile-captcha',
  templateUrl: './turnstile-captcha.component.html',
  styleUrls: ['./turnstile-captcha.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TurnstileCaptchaComponent),
      multi: true
    }
  ]
})
export class TurnstileCaptchaComponent implements AfterViewInit, ControlValueAccessor {
  @Input() siteKey!: string;
  @Input() theme: 'light' | 'dark' = 'light';
  @Input() size: 'normal' | 'compact' | 'invisible' | 'flexible' = 'flexible';

  @Output() captchaError = new EventEmitter<void>();

  private captchaRendered = false;
  private captchaToken: string | null = null;

  private onChange = (token: string | null) => {};
  private onTouched = () => {};

  ngAfterViewInit(): void {
    if (!this.captchaRendered) {
      this.renderTurnstile();
    }
  }

  private renderTurnstile(): void {
    try {
      const turnstile = (window as any).turnstile;
      if (turnstile) {
        turnstile.render('#turnstile-container', {
          sitekey: this.siteKey,
          callback: this.javascriptCallback.bind(this),
          theme: this.theme,
          size: this.size,
          'error-callback': this.errorCallback.bind(this),
          'expired-callback': this.expiredCallback.bind(this),
          language: 'uk'
        });
        this.captchaRendered = true;
      } else {
        console.error('Turnstile library is not available on the window object.');
      }
    } catch (error) {
      console.error('Error initializing Turnstile:', error);
    }
  }

  private javascriptCallback(token: string): void {
    this.captchaToken = token;
    this.onChange(token);
    this.onTouched();
  }

  private errorCallback(): void {
    console.error('An error occurred during CAPTCHA validation.');
    this.captchaError.emit();
    this.onChange(null);
  }

  private expiredCallback(): void {
    console.error('Captcha token has expired.');
    this.onChange(null);
  }

  writeValue(token: string | null): void {
    this.captchaToken = token;
  }

  registerOnChange(fn: (token: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}

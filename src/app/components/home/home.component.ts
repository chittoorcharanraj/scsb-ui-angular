import { Component, OnInit, ElementRef, HostListener, ViewChild } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from '@service/login/login.service';
import { urls } from '@config/urls';
import { environment } from 'src/environments/environment';
import { DashBoardService } from '@service/dashBoard/dash-board.service';
@Component({
  standalone: false,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent implements OnInit {
  constructor(private loginService: LoginService, private cookieService: CookieService,
              private dashBoardService: DashBoardService, private elementRef: ElementRef) { }
  reloadStatus: boolean;
  institution: string = 'default';
  url: string = '';
  casPrefix = urls.CAS_PREFIX;
  redirectForm: UntypedFormGroup;
  serviceUrl: string;
  submitted = false;
  Institutions: any = [];
  institutionErrorMessageDiv = false;
  validate: boolean = false;

  // ----- Modern searchable institution dropdown state -----
  @ViewChild('institutionSearchInput') institutionSearchInput: ElementRef<HTMLInputElement>;
  institutionsList: { key: string, value: string }[] = [];
  filteredInstitutions: { key: string, value: string }[] = [];
  selectedInstitutionName: string = '';
  searchTerm: string = '';
  isDropdownOpen: boolean = false;
  highlightedIndex: number = -1;

  get showSelectedChip(): boolean {
    return !!this.selectedInstitutionName && !this.isDropdownOpen;
  }

  private institutionLogoMap: { match: string, src: string }[] = [
    { match: 'princeton', src: '../../../assets/images/member-logo/princeton-logo.png' },
    { match: 'columbia', src: '../../../assets/images/member-logo/columbia-logo.png' },
    { match: 'harvard', src: '../../../assets/images/member-logo/harvard-logo.png' },
    { match: 'new york public', src: '../../../assets/images/member-logo/nypl-logo.png' },
    { match: 'nypl', src: '../../../assets/images/member-logo/nypl-logo.png' },
    { match: 'yale', src: '../../../assets/images/member-logo/yale-logo.png' }
  ];

  ngAfterViewInit() {
    // @ts-ignore
    twttr.widgets.load();
  }

  ngOnInit(): void {
    this.url = '';
    this.cookieService.deleteAll();
    localStorage.clear();
    this.institution = 'default';
    this.loginService.getInstitutions().subscribe(
      (res) => {
        this.Institutions = res;
        this.institutionsList = Object.keys(res).map((key) => ({ key, value: res[key] }));
        this.filteredInstitutions = this.institutionsList;
      },
      (error) => {
        this.dashBoardService.errorNavigation();
      });
  }
  changeInst() {
    if (this.institution == 'default') {
      this.institutionErrorMessageDiv = true;
      this.validate = false;
    } else {
      this.institutionErrorMessageDiv = false;
      this.url = environment.homeUrl + this.casPrefix + this.institution;
      this.validate = true;
    }
  }
  returnZero() {
    return 0
  }

  // ----- Dropdown interaction -----
  // The Institution field IS the search input (no separate trigger/header).
  // Opening clears it for a fresh search; closing without a selection
  // restores whatever was previously chosen.

  openDropdown(): void {
    if (this.isDropdownOpen) {
      return;
    }
    this.isDropdownOpen = true;
    this.searchTerm = '';
    this.filteredInstitutions = this.institutionsList;
    this.highlightedIndex = this.institutionsList.findIndex((inst) => inst.key === this.institution);
  }

  closeDropdown(revertText: boolean = true): void {
    this.isDropdownOpen = false;
    if (revertText) {
      this.searchTerm = this.selectedInstitutionName || '';
    }
  }

  filterInstitutions(): void {
    const term = (this.searchTerm || '').trim().toLowerCase();
    this.filteredInstitutions = !term
      ? this.institutionsList
      : this.institutionsList.filter((inst) => inst.value.toLowerCase().includes(term));
    this.highlightedIndex = this.filteredInstitutions.length ? 0 : -1;
  }

  selectInstitution(inst: { key: string, value: string }): void {
    this.institution = inst.key;
    this.selectedInstitutionName = inst.value;
    this.searchTerm = inst.value;
    this.isDropdownOpen = false;
    this.changeInst();
    if (this.institutionSearchInput) {
      this.institutionSearchInput.nativeElement.blur();
    }
  }

  // Prevent the input from blurring when an option is clicked, so the
  // required-field validation below doesn't briefly flash on selection.
  onOptionMouseDown(event: MouseEvent): void {
    event.preventDefault();
  }

  onInputBlur(): void {
    this.isDropdownOpen = false;
    this.searchTerm = this.selectedInstitutionName || '';
    this.changeInst();
  }

  onFormSubmit(event: Event): void {
    // Always re-validate on submit instead of trusting whatever state was
    // left behind by focus/blur timing. This guarantees:
    //  - an invalid (no institution) submit always shows the required
    //    message and never navigates, even if Submit is clicked before the
    //    input was ever focused/blurred.
    //  - a valid selection always proceeds.
    this.changeInst();

    // Always stop the browser's native form submission here. The form has
    // no [method], so it defaults to GET, and per the native form
    // submission algorithm a GET submit rebuilds the action URL's query
    // string from the serialized form fields -- even when that
    // serialization is empty (the search input intentionally has no
    // `name`, since it's a UI-only search box, not a submittable field).
    // That silently strips any query parameters already present in
    // `this.url` (the existing CAS/login redirect URL built by
    // changeInst()), so a valid submit would appear to do nothing. Instead
    // we always prevent the native submission and, when valid, navigate to
    // the exact same existing `this.url` ourselves -- same target route,
    // params and business logic, just a reliable trigger for it.
    event.preventDefault();

    if (!this.validate) {
      return;
    }

    window.location.href = this.url;
  }

  onSearchKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (this.filteredInstitutions.length) {
        this.highlightedIndex = (this.highlightedIndex + 1) % this.filteredInstitutions.length;
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (this.filteredInstitutions.length) {
        this.highlightedIndex = this.highlightedIndex <= 0
          ? this.filteredInstitutions.length - 1
          : this.highlightedIndex - 1;
      }
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (this.highlightedIndex > -1 && this.filteredInstitutions[this.highlightedIndex]) {
        this.selectInstitution(this.filteredInstitutions[this.highlightedIndex]);
      }
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.closeDropdown();
    }
  }

  // Clears both the UI chip/search text AND the underlying institution
  // value the Submit handler relies on, so no stale id is left behind.
  clearInstitution(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.institution = 'default';
    this.selectedInstitutionName = '';
    this.searchTerm = '';
    this.url = '';
    this.validate = false;
    this.filteredInstitutions = this.institutionsList;
    if (this.institutionSearchInput) {
      this.institutionSearchInput.nativeElement.focus();
    }
    this.openDropdown();
  }

  getInstitutionLogo(name: string): string | null {
    const lower = (name || '').toLowerCase();
    const found = this.institutionLogoMap.find((entry) => lower.includes(entry.match));
    return found ? found.src : null;
  }

  getInitials(name: string): string {
    return (name || '')
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isDropdownOpen && this.elementRef && !this.elementRef.nativeElement.contains(event.target)) {
      this.closeDropdown(true);
    }
  }
  getinTouch: any[] = [{
    "for": "Princeton users, Role administration, please contact",
    "url": 'mailto:Recapproblems@princeton.edu',
    "name": 'Recapproblems@princeton.edu'
  },

  {
    "for": "Princeton users, Technical support, please contact",
    "url": 'mailto:mzelesky@princeton.edu',
    "name": 'mzelesky@princeton.edu'

  },
  {
    "for": "Columbia users, contact",
    "url": 'mailto:recap.admin@library.columbia.edu',
    "name": 'recap.admin@library.columbia.edu'
  },
  {
    "for": "NYPL users, contact",
    "url": 'mailto:ReCAPinterface@nypl.org',
    "name": 'ReCAPinterface@nypl.org'
  }

  ];

}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface CarBrand {
  name: string;
  logo: string;
  code: string;
}

@Component({
  selector: 'app-all-car-brands',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all-car-brands.component.html',
  styleUrls: ['./all-car-brands.component.css']
})
export class AllCarBrandsComponent {
  constructor(private router: Router) {}

  allBrands: CarBrand[] = [
    { name: 'ALFA ROMEO', logo: 'https://bcdn.aloparca.com/car-maker-images/marka_alfaromeo.svg', code: 'alfa-romeo' },
    { name: 'AUDI', logo: 'https://bcdn.aloparca.com/car-maker-images/marka_audi.svg', code: 'audi' },
    { name: 'BMW', logo: 'https://bcdn.aloparca.com/car-maker-images/marka_bmw.svg', code: 'bmw' },
    { name: 'CHERY', logo: 'https://bcdn.aloparca.com/car-maker-images/marka_chery.svg', code: 'chery' },
    { name: 'CHEVROLET', logo: 'https://bcdn.aloparca.com/car-maker-images/marka_chevrolet.svg', code: 'chevrolet' },
    { name: 'CHRYSLER', logo: 'https://bcdn.aloparca.com/car-maker-images/marka_chrysler.svg', code: 'chrysler' },
    { name: 'CITROËN', logo: 'https://bcdn.aloparca.com/car-maker-images/marka_citroen.svg', code: 'citroen' },
    { name: 'CUPRA', logo: 'https://bcdn.aloparca.com/car-maker-images/marka_cupra.svg', code: 'cupra' },
    { name: 'DACIA', logo: 'https://bcdn.aloparca.com/car-maker-images/marka_dacia.svg', code: 'dacia' },
    { name: 'DAEWOO', logo: 'https://bcdn.aloparca.com/car-maker-images/marka_daewoo.svg', code: 'daewoo' },
    { name: 'DAIHATSU', logo: 'https://bcdn.aloparca.com/car-maker-images/marka_daihatsu.svg', code: 'daihatsu' },
    { name: 'DODGE', logo: 'https://bcdn.aloparca.com/car-maker-images/marka_dodge.svg', code: 'dodge' },
    { name: 'DS', logo: 'https://bcdn.aloparca.com/car-maker-images/marka_ds.svg', code: 'ds' },
    { name: 'FIAT', logo: 'https://bcdn.aloparca.com/car-maker-images/marka_fiat.svg', code: 'fiat' },
    { name: 'FORD', logo: 'https://bcdn.aloparca.com/car-maker-images/marka_ford.svg', code: 'ford' },
    { name: 'HONDA', logo: 'https://bcdn.aloparca.com/car-maker-images/marka_honda.svg', code: 'honda' },
    { name: 'HYUNDAI', logo: 'https://bcdn.aloparca.com/car-maker-images/marka_hyundai.svg', code: 'hyundai' },
    { name: 'INFINITI', logo: 'https://bcdn.aloparca.com/car-maker-images/marka_infiniti.svg', code: 'infiniti' },
    { name: 'ISUZU', logo: 'https://bcdn.aloparca.com/car-maker-images/marka_isuzu.svg', code: 'isuzu' },
    { name: 'IVECO', logo: 'https://bcdn.aloparca.com/car-maker-images/marka_iveco.svg', code: 'iveco' },
    { name: 'JAGUAR', logo: 'https://bcdn.aloparca.com/car-maker-images/marka_jaguar.svg', code: 'jaguar' },
    { name: 'JEEP', logo: 'https://bcdn.aloparca.com/car-maker-images/marka_jeep.svg', code: 'jeep' },
    { name: 'LANCIA', logo: 'https://bcdn.aloparca.com/car-maker-images/marka_lancia.svg', code: 'lancia' },
    { name: 'LAND ROVER', logo: 'https://bcdn.aloparca.com/car-maker-images/marka_landrover.svg', code: 'land-rover' },
    { name: 'LEXUS', logo: 'https://bcdn.aloparca.com/car-maker-images/marka_lexus.svg', code: 'lexus' },
    { name: 'MAN', logo: 'https://bcdn.aloparca.com/car-maker-images/marka_man.svg', code: 'man' },
    { name: 'MAZDA', logo: 'https://bcdn.aloparca.com/car-maker-images/marka_mazda.svg', code: 'mazda' },
    { name: 'MERCEDES-BENZ', logo: 'https://bcdn.aloparca.com/car-maker-images/marka_mercedes-benz.svg', code: 'mercedes' },
    { name: 'MINI', logo: 'https://bcdn.aloparca.com/car-maker-images/marka_mini.svg', code: 'mini' },
    { name: 'MITSUBISHI', logo: 'https://bcdn.aloparca.com/car-maker-images/marka_mitsubishi.svg', code: 'mitsubishi' },
    { name: 'NISSAN', logo: 'https://bcdn.aloparca.com/car-maker-images/marka_nissan.svg', code: 'nissan' },
    { name: 'OPEL', logo: 'https://bcdn.aloparca.com/car-maker-images/marka_opel.svg', code: 'opel' },
    { name: 'PEUGEOT', logo: 'https://bcdn.aloparca.com/car-maker-images/marka_peugeot.svg', code: 'peugeot' },
    { name: 'PORSCHE', logo: 'https://bcdn.aloparca.com/car-maker-images/marka_porsche.svg', code: 'porsche' },
    { name: 'RENAULT', logo: 'https://bcdn.aloparca.com/car-maker-images/marka_renault.svg', code: 'renault' },
    { name: 'SAAB', logo: 'https://bcdn.aloparca.com/car-maker-images/marka_saab.svg', code: 'saab' },
    { name: 'SEAT', logo: 'https://bcdn.aloparca.com/car-maker-images/marka_seat.svg', code: 'seat' },
    { name: 'SKODA', logo: 'https://bcdn.aloparca.com/car-maker-images/marka_skoda.svg', code: 'skoda' },
    { name: 'SMART', logo: 'https://bcdn.aloparca.com/car-maker-images/marka_smart.svg', code: 'smart' },
    { name: 'SUBARU', logo: 'https://bcdn.aloparca.com/car-maker-images/marka_subaru.svg', code: 'subaru' },
    { name: 'SUZUKI', logo: 'https://bcdn.aloparca.com/car-maker-images/marka_suzuki.svg', code: 'suzuki' },
    { name: 'TESLA', logo: 'https://bcdn.aloparca.com/car-maker-images/marka_tesla.svg', code: 'tesla' },
    { name: 'KIA', logo:'https://bcdn.aloparca.com/car-maker-images/marka_kia.svg', code: 'kia'},
    { name: 'TOYOTA', logo: 'https://bcdn.aloparca.com/car-maker-images/marka_toyota.svg', code: 'toyota' },
    { name: 'VOLKSWAGEN', logo: 'https://bcdn.aloparca.com/car-maker-images/marka_volkswagen.svg', code: 'volkswagen' },
    { name: 'VOLVO', logo: 'https://bcdn.aloparca.com/car-maker-images/marka_volvo.svg', code: 'volvo' },
  ];

  alphabet: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  selectedLetter: string = 'ALL';

  get filteredBrands() {
    if (this.selectedLetter === 'ALL') return this.allBrands;
    return this.allBrands.filter(brand => brand.name.startsWith(this.selectedLetter));
  }

  selectLetter(letter: string) {
    this.selectedLetter = letter;
  }

  goToBrandModels(brandCode: string) {
    this.router.navigate(['/vehicle-models', brandCode]);
  }
}

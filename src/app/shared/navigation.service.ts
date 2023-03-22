import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class NavigationService {
    menu!: any[] | null;
    isSidenavOpened = false;

    setFocus(id: string) {
        this.removeFocus();
        document.querySelector(`#${id}`)?.classList.add('item-selected');   
    }
    
    removeFocus() {
        document.querySelectorAll('button')?.forEach(element => element?.classList.remove('item-selected'));
    }

}

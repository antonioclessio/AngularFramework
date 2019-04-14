import { Injectable } from '@angular/core';

/** @description Classe 'helper' com funções diversas e úteis  */
@Injectable({
    providedIn: 'root'
})
export class HelperLibrary {

    /** @description
     * Transforma um objeto com filhos em um objeto flat. Importante que tanto o objeto pai quanto
     * os filhos sejam do mesmo tipo
     * @param source Objeto origem que será transformado em um objeto flat.
     * @returns Array flat do mesmo tipo passado por parâmetro.
     */
    flatJsonObject<T>(source: T[]): T[] {
        const flatObject: T[] = [];
        const newSource = JSON.parse(JSON.stringify(source));

        newSource.forEach(item => {
            flatObject.push(item);

            const props = Object.getOwnPropertyNames(item);
            props.forEach(prop => {
                if (typeof item[prop] === 'object' && item[prop] !== null) {
                    const array = this.flatJsonObject(item[prop]);

                    array.forEach(newItem => flatObject.push(newItem as T));
                    item[prop] = null;
                }
            });
        });

        return flatObject;
    }

    /**
     * A function to take a string written in dot notation style, and use it to
     * find a nested object property inside of an object.
     *
     * Useful in a plugin or module that accepts a JSON array of objects, but
     * you want to let the user specify where to find various bits of data
     * inside of each custom object instead of forcing a standardized
     * property list.
     *
     * @param String nested A dot notation style parameter reference (ie "urls.small")
     * @param Object object (optional) The object to search
     *
     * @return the value of the property in question
     */
    getPropertyValue( propertyName, object ) {
        const parts = propertyName.split('.');
        const length = parts.length;
        let property = object || this;

        for (let i = 0; i < length; i++ ) {
            property = property[parts[i]];
        }

        return property;
    }

}

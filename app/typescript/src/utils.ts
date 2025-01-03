let bootoast: any;
if (window.jQuery) import('bootoast').then(_bootoast => bootoast = _bootoast);

import tinycolor from 'tinycolor2';

const baseBootoastOptions = {
  position: 'bottom-center',
  timeout: 3,
  animationDuration: 150,
  dismissable: true
};

export function bsToast(type: string, message: string) {
  bootoast?.toast({ ...baseBootoastOptions, type, message });
}

// Using css variables to capture style allows for use of the custom-button-variant mixin,
// which itself is just a copy of bootstrap's button-variant mixin that has been modified to use css variables.
// Thus standard bootstrap styling is conserved while allowing for dynamic custom button colors.
export function setCustomButtonProps(btn: HTMLElement) {
  const { bgColor, color } = btn.dataset as { bgColor: string, color: string };
  btn.style.setProperty('--btn-custom-bg', bgColor);
  btn.style.setProperty('--btn-custom-bg-darken-10', tinycolor(bgColor).darken(10).toString());
  btn.style.setProperty('--btn-custom-bg-darken-17', tinycolor(bgColor).darken(17).toString());
  btn.style.setProperty('--btn-custom-border', bgColor);
  btn.style.setProperty('--btn-custom-border-darken-12', tinycolor(bgColor).darken(12).toString());
  btn.style.setProperty('--btn-custom-border-darken-25', tinycolor(bgColor).darken(25).toString());
  btn.style.setProperty('--btn-custom-color', color);
}

export function parseDatasetObject<Type>(element: HTMLElement, prop: string, ...requiredProps: string[]): Type | null {
  try {
    const parsedData: Type = JSON.parse(element.dataset[prop] || '');
    if (parsedData && typeof parsedData === 'object') {
      return requiredProps.every(prop => parsedData.hasOwnProperty(prop)) ? parsedData : null;
    }
  } catch (err) {
    return null;
  }
  return null;
}

export async function getJSON(dataPath: string, params: string) {
  const csrfTokenMeta = document.querySelector<HTMLMetaElement>('[name="csrf-token" ]');
  const csrfToken = csrfTokenMeta?.content;
  if (csrfToken) {
    const options: RequestInit = {
      headers: {
        'Content-Type': 'application/json', 
        'X-CSRF-Token': csrfToken
      }
    };
    try {
      // return await Promise.all([
      //   fetch('/successes', headers).then(res => res.json()), 
      //   fetch('/companies/0/contributions', headers).then(res => res.json())
      // ]);
      return await fetch(`${dataPath}.json${params ? '?' + params : ''}` , options).then(res => res.json());
    } catch(err) {
      console.error(err);
    }
  } else {
    console.error(`No CSRF token found for fetch(${dataPath}.json)`)
  }
}

export function debounce(callback: VoidFunction, wait: number, immediate = false) {
  let timeout: number | null;
  return () => {
    const later = () => {
      timeout = null;
      if (!immediate) callback.call(null);
    };
    if (immediate && !timeout) {
      callback.call(null);
    } else {
      clearTimeout(<number>timeout);
      timeout = setTimeout(later, wait) as any as number;
    }
  };
}

export function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function kebabToCamel(str: string) {
  return str.replace(/-./g, (char) => char[1].toUpperCase());
}

export function kebabize(str: string) {
  return str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? "-" : "") + $.toLowerCase());
}

// export function copyToClipboard(str) {
//   const onCopy = (e) => {
//     e.clipboardData.setData("text/html", str);
//     e.clipboardData.setData("text/plain", str);
//     e.preventDefault();
//   };
//   document.addEventListener("copy", onCopy);
//   document.execCommand("copy");
//   document.removeEventListener("copy", onCopy);
// }

export function distinctItems(items: string[] | number[]) {
  return items.filter((item, i, _items) => i === _items.indexOf(item));
}

export function distinctObjects(objects: { [i: string]: any }[], attr: string) {
  return objects.filter((obj, i, _objects) => i === _objects.findIndex(_obj => _obj[attr] === obj[attr]));
}

export function serializeForm(form: HTMLFormElement) {
  const formData = new FormData(form);
  return Array
    .from(formData.entries())
    .map(([field, value]) => (
      encodeURIComponent(field) + '=' + encodeURIComponent(value as string | number | boolean)
    ))
    .join('&');
}
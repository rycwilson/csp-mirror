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

export async function getJSON(dataPath: string) {
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
      return await fetch(`${dataPath}.json`, options).then(res => res.json());
    } catch(err) {
      console.error(err);
    }
  } else {
    console.error(`No CSRF token found for fetch(${dataPath}.json)`)
  }
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
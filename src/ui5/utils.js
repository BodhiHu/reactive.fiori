
let nextCtrlIDIndex = 0;

function uniqueId (key = "", localIDStore) {
  let id;
  id = localIDStore && localIDStore.get(key);
  if (id) {
    return id;
  }

  id = `rfid-${key}-${nextCtrlIDIndex += 1}`
  localIDStore && localIDStore.set(key, id);

  return id;
}

export function createIDStore () {
  return {
    ids: {
      //"id-key": "id-value",
    },
    get (idKey) {
      return this.ids[idKey];
    },
    set (idKey, idValue) {
      this.ids[idKey] = idValue;
    },
    uniqueId (key) {
      if (!key || key.length === 0) {
        console.error("You must provide a valid string for key");
        return undefined;
      }
      return uniqueId(key, this);
    }
  };
}

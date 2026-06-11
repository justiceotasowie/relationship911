function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class relationshipdata {
  constructor(category) {
    this.category = category;
    this.path = `/json/${this.category}.json`;
  }
  
  async getData() {
    const res = await fetch(this.path);
    return convertToJson(res); // returns {category, heroImage, heroTitle, items}
  }

  async findProductById(id) {
    const data = await this.getData();
    
    // Use data.items, not data directly
    return data.items.find((item) => Number(item.id) === Number(id));
  }
}
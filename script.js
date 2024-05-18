
            document.addEventListener("DOMContentLoaded", function () {
                // Temporary bag data
                const bags = [
                    {
                        name: "Stylish Backpack",
                        imageUrl: "images/bag1.jpg",
                        description: "A trendy backpack for everyday use."
                    },
                    {
                        name: "Leather Messenger Bag",
                        imageUrl: "images/bag2.jpg",
                        description: "Classic leather messenger bag, perfect for work or travel."
                    },
                    {
                        name: "Canvas Tote Bag",
                        imageUrl: "images/bag3.jpg",
                        description: "Casual canvas tote bag for shopping or beach outings."
                    },
                    {
                        name: "Canvas Tote Bag",
                        imageUrl: "images/bag4.jpg",
                        description: "Casual canvas tote bag for shopping or beach outings."
                    },
                    {
                        name: "Canvas Tote Bag",
                        imageUrl: "images/bag5.jpg",
                        description: "Casual canvas tote bag for shopping or beach outings."
                    },
                ];

                const bagContainer = document.getElementById("bagContainer");

                // Loop through bag data and create HTML elements
                bags.forEach(bag => {
                    const bagElement = document.createElement("div");
                    bagElement.classList.add("bag");

                    const imgElement = document.createElement("img");
                    imgElement.src = bag.imageUrl;
                    imgElement.alt = bag.name;

                    const h2Element = document.createElement("h2");
                    h2Element.textContent = bag.name;

                    const pElement = document.createElement("p");
                    pElement.textContent = bag.description;

                    bagElement.appendChild(imgElement);
                    bagElement.appendChild(h2Element);
                    bagElement.appendChild(pElement);

                    bagContainer.appendChild(bagElement);
                });
            });
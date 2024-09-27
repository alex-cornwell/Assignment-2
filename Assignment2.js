"use strict";
class Hawaiian {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.color = true;
        this.left = null;
        this.right = null;
        this.parent = null;
    }
}
/* I decided to use a Red-Black Binary Search Tree for the dictionary because it can maintain balance of the tree and ensure fast search, insertion,
 and deletion. Since the red-black tree stays balanced, it prevents cases that would lower the performance for performing these operations
 and stays at a time complexity of O(log n). A red-black tree is also efficient because its able to "fix" the tree after an insertion by
 recoloring and rotating elements to maintain balance. */
class Dictionary {
    constructor() {
        this.root = null;
    }
    rotateLeft(node) {
        const rightChild = node.right;
        node.right = rightChild.left;
        if (rightChild.left) {
            rightChild.left.parent = node;
        }
        rightChild.parent = node.parent;
        if (!node.parent) {
            this.root = rightChild;
        }
        else if (node === node.parent.left) {
            node.parent.left = rightChild;
        }
        else {
            node.parent.right = rightChild;
        }
        rightChild.left = node;
        node.parent = rightChild;
    }
    /* */
    rotateRight(node) {
        const leftChild = node.left;
        node.left = leftChild.right;
        if (leftChild.right) {
            leftChild.right.parent = node;
        }
        leftChild.parent = node.parent;
        if (!node.parent) {
            this.root = leftChild;
        }
        else if (node === node.parent.left) {
            node.parent.left = leftChild;
        }
        else {
            node.parent.right = leftChild;
        }
        leftChild.right = node;
        node.parent = leftChild;
    }
    fixInsert(node) {
        while (node.parent && node.parent.color) {
            if (node.parent === node.parent.parent.left) {
                const uncle = node.parent.parent.right;
                if (uncle && uncle.color) {
                    node.parent.color = false;
                    uncle.color = false;
                    node.parent.parent.color = true;
                    node = node.parent.parent;
                }
                else {
                    if (node === node.parent.right) {
                        node = node.parent;
                        this.rotateLeft(node);
                    }
                    node.parent.color = false;
                    node.parent.parent.color = true;
                    this.rotateRight(node.parent.parent);
                }
            }
            else {
                const uncle = node.parent.parent.left;
                if (uncle && uncle.color) {
                    node.parent.color = false;
                    uncle.color = false;
                    node.parent.parent.color = true;
                    node = node.parent.parent;
                }
                else {
                    if (node === node.parent.left) {
                        node = node.parent;
                        this.rotateRight(node);
                    }
                    node.parent.color = false;
                    node.parent.parent.color = true;
                    this.rotateLeft(node.parent.parent);
                }
            }
        }
        this.root.color = false;
    }
    member(saying) {
        let current = this.root;
        while (current) {
            if (saying === current.key) {
                return true;
            }
            else if (saying < current.key) {
                current = current.left;
            }
            else {
                current = current.right;
            }
        }
        return false;
    }
    first() {
        let current = this.root;
        if (!current)
            return null;
        while (current.left) {
            current = current.left;
        }
        return current.key;
    }
    last() {
        let current = this.root;
        if (!current)
            return null;
        while (current.right) {
            current = current.right;
        }
        return current.key;
    }
    predecessor(saying) {
        let current = this.findNode(saying);
        if (!current)
            return current.key;
        if (current.left) {
            current = current.left;
            while (current.right) {
                current = current.right;
            }
            return current.key;
        }
        let parent = current.parent;
        while (parent && current === parent.left) {
            current = parent;
            parent = parent.parent;
        }
        return parent.key;
    }
    successor(saying) {
        let current = this.findNode(saying);
        if (!current)
            return current.key;
        if (current.right) {
            current = current.right;
            while (current.left) {
                current = current.left;
            }
            return current.key;
        }
        let parent = current.parent;
        while (parent && current === parent.right) {
            current = parent;
            parent = parent.parent;
        }
        return parent.key;
    }
    findNode(saying) {
        let current = this.root;
        while (current) {
            if (saying === current.key) {
                return current;
            }
            else if (saying < current.key) {
                current = current.left;
            }
            else {
                current = current.right;
            }
        }
        return null;
    }
    insert(saying, value) {
        const newNode = new Hawaiian(saying, value);
        let parent = null;
        let current = this.root;
        while (current) {
            parent = current;
            if (newNode.key < current.key) {
                current = current.left;
            }
            else {
                current = current.right;
            }
        }
        newNode.parent = parent;
        if (!parent) {
            this.root = newNode;
        }
        else if (newNode.key < parent.key) {
            parent.left = newNode;
        }
        else {
            parent.right = newNode;
        }
        this.fixInsert(newNode);
    }
    meHua(word) {
        const results = [];
        const search = (node) => {
            if (node) {
                search(node.left);
                if (node.key.includes(word)) {
                    results.push({ saying: node.key });
                }
                search(node.right);
            }
        };
        search(this.root);
        return results;
    }
    withWord(word) {
        const results = [];
        const search = (node) => {
            if (node) {
                search(node.left);
                if (node.value.translation.includes(word)) {
                    results.push({ saying: node.key });
                }
                search(node.right);
            }
        };
        search(this.root);
        return results;
    }
}
// Dictionary entries
const tree = new Dictionary();
tree.insert("'A'ahu 'ili kao", { translation: "Wearer of goat hide", explanation: { english: "An expression of contempt for a person who is so lazy he uses goat hides instead of mats, which require work to make, for his bedding. Such a person is recognized by his goaty odor.", hawaiian: "He hoike hoowahawaha i ke kanakaʻO ka mea palaualelo, hoʻohana ʻo ia i ka ʻili kaoma kahi o ka moena e pono ai ka hanae hana, no kona wahi moe. ʻO ia ʻano aʻike ʻia ke kanaka e kona ʻala kao." } });
tree.insert("A 'ai ka manu i luna.", { translation: "The birds feed above.", explanation: { english: "An attractive person is compared to a flower-laden tree that attracts birds.", hawaiian: "Hoʻohālikelike ʻia ke kanaka uʻi me a lāʻau pua e hoʻohihi manu." } });
tree.insert("E 'ai i ka mea i loa'a.", { translation: "What you have, eat.", explanation: { english: "Be satisfied with what you have.", hawaiian: "E māʻona i kāu mea i loaʻa." } });
tree.insert("E ala, e hoa i ka malo.", { translation: "Get up and gird your loincloth.", explanation: { english: "A call to rise and get to work.", hawaiian: "He kāhea e ala a hele i ka hana." } });
tree.insert("Ha'alele 'ia i muhwa'a.", { translation: "Left on the very last canoe.", explanation: { english: "Said of one who is left behind.", hawaiian: "Wahi a kekahi i waiho ʻia." } });
tree.insert("Ha'alele o Makanikeoe.", { translation: "Makanikeoe has departed.", explanation: { english: "Peace and love are no longer here.", hawaiian: "ʻAʻohe maluhia a me ke aloha." } });
tree.insert("I hele no ka hola i'a i ka lā.", { translation: "Poison fish while it is day.", explanation: { english: "It is better to work during the day.", hawaiian: "ʻOi aku ka maikaʻi o ka hana i ka lā." } });
tree.insert("Ihea no ka lima a 'au mai?", { translation: "Where are the arms with which to swim?", explanation: { english: "Don't complain, use your limbs to do what you need to do.", hawaiian: "Mai ʻōhumu, e hoʻohana i kou mau lālā e hana i kāu mea e pono ai ke hana." } });
tree.insert("Ka 'ai niho 'ole a ka makani i ka 'ai.", { translation: "Even without teeth the wind consumes the food crops.", explanation: { english: "Said of a destructive windstorm.", hawaiian: "Ua ʻōlelo ʻia no ka makani ʻino." } });
tree.insert("Ka'a ka pōhaku.", { translation: "The stones roll.", explanation: { english: "Thunder.", hawaiian: "Hekili." } });
tree.insert("Lāhui pua o lalo.", { translation: "The many flowers below.", explanation: { english: "The commoners.", hawaiian: "ʻO nā makaʻāinana." } });
tree.insert("La'i lua ke kai.", { translation: "The sea is very calm.", explanation: { english: "All is peaceful.", hawaiian: "Ua maluhia nā mea a pau." } });
tree.insert("Māhanalua na kukui.", { translation: "The lights are doubled.", explanation: { english: "Said of a drunk person who sees double.", hawaiian: "Wahi a kekahi kanaka ʻona ʻike pālua." } });
tree.insert("Mai ka ā a ka w.", { translation: "From A to W.", explanation: { english: "The alphabet of Hawaiian.", hawaiian: "ʻO ka pīʻāpā o ka ʻōlelo Hawaiʻi." } });
tree.insert("Nahā ka mākāhā, lele ka 'upena.", { translation: "When the sluice gate breaks, the fishnets are lowerd. ", explanation: { english: "One's loss may be another's gain.", hawaiian: "ʻO ka lilo o kekahi, ʻo ia ka waiwai o kekahi." } });
tree.insert("Na kai 'ewalu.", { translation: "The eight seas.", explanation: { english: "The \"seas\" that divide the eight inhabited islands.", hawaiian: "ʻO nā \"kai\" e māhele ana i ka ʻewalu mokupuni kanaka." } });
tree.insert("'Ohi aku ka pō a koe kêia.", { translation: "The night has taken all but this one.", explanation: { english: "All are dead; this is the only survivor.", hawaiian: "Ua make nā mea a pau; ʻo kēia wale nō ke ola." } });
tree.insert("'Ōhule ke po'o i niania.", { translation: "Bald of head and smooth.", explanation: { english: "Said of a bald-headed man.", hawaiian: "Wahi a kekahi kanaka ʻōhule." } });
tree.insert("Pa'a ka moku i ka helēuma.", { translation: "The ship is heldfast by the anchor.", explanation: { english: "Said of one who is married.", hawaiian: "Wahi a kekahi i male." } });
tree.insert("Pa'a no ka 'aihue i ka 'ole", { translation: "A thief persists in denying his guilt.", explanation: { english: "A thief is also a liar.", hawaiian: "He wahahee ka aihue." } });
// Test cases for the member method
console.log(tree.member("'A'ahu 'ili kao")); // expected: true 
console.log(tree.member("Ka'a ka pohaku.")); // expected: true 
console.log(tree.member("Non-existent Saying")); // expected: false 
// Test first() method
console.log("First entry in dictionary:", tree.first()); // expected: "'A'ahu 'ili kao"
// Test last() method
console.log("Last entry in dictionary:", tree.last()); // expected: "Pa'a no ka 'aihue i ka 'ole"
// Test successor() method
console.log("Successor to 'Ka'a ka pōhaku.':", tree.successor("Ka'a ka pōhaku.")); // expected: "La'i lua ke kai."
// Test predecessor() method
console.log("Predecessor to 'Na kai 'ewalu.':", tree.predecessor("Na kai 'ewalu.")); // expected: "Māhanalua na kukui."
// Searching sayings
console.log(tree.meHua("'ai")); // expected: [{saying: "A 'ai ka manu i luna." },{saying: "E 'ai i ka mea i loa'a." },{saying: "Ka 'ai niho 'ole a ka makani i ka 'ai." },{saying: "Pa'a no ka 'aihue i ka 'ole" }]
console.log(tree.withWord("is")); // expected: [{ saying: "'Ohi aku ka pō a koe kêia." },{ saying: "I hele no ka hola i'a i ka lā." },{ saying: "La'i lua ke kai." }, ...]
/* Reference List
- Mary Kawena Pukui (editor, translator). ʻŌlelo Noʻeau: Hawaiian Proverbs & Poetical Sayings. Bishop Museum Press; 1983. Accessed
  September 22, 2024. https://search-ebscohost-com.eres.library.manoa.hawaii.edu/login.aspx?direct=true&db=nlebk&AN=2575808&site=ehost-live
- 1. Cormen TH, Leiserson CE, Rivest RL, Stein C. Introduction to Algorithms Thomas H. Cormen Aut; Charles E. Leiserson Aut; Ronald L. Rivest Aut;
  Clifford Stein Aut. The MIT Press; 2022. */ 

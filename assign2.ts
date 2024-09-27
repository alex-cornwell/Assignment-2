class Hawaiian { 
    key: string; // Hawaiian saying
    value: {translation: string; explanation: {english: string; hawaiian: string}};
    color: boolean; // True = red, False = black
    left: Hawaiian | null;
    right: Hawaiian | null;
    parent: Hawaiian | null;

    constructor(key: string, value: {translation: string; explanation: {english: string; hawaiian: string}}) {
        this.key = key;
        this.value = value;
        this.color = true; 
        this.left = null; 
        this.right = null; 
        this.parent = null;
    }
}
/*  I decided to use a Binary Search Tree (BST) because it is able to support Member, First, Last, Predecessor, Sucessor, and Insert. Because of this, a search tree is 
    also effective for being used as a dictionary. A BST is able to perform these operations in O(n) time so the time for these processes to take is short, however if the 
    tree height is large, the set operations would not run any faster than a linked list. Thats why I am specifically using a Red-Black Tree for the dictionary because 
    it can maintain balance of the tree and ensure fast search, insertion, and deletion. Since the red-black tree stays balanced, it prevents cases that would lower the 
    performance for performing these operations and stays at a time complexity of O(log n) in the worst cases. A red-black tree is also efficient because its able to "fix" 
    the tree after an insertion by recoloring and rotating elements to maintain balance. (Cormen et al., 2022, p. 331) */

class Dictionary {
    private root: Hawaiian | null = null;

    private rotateLeft(node: Hawaiian): void { // (Cormen et al., 2022, p. 336)
        const rightChild = node.right!;
        node.right = rightChild.left;
        if(rightChild.left) {
            rightChild.left.parent = node;
        }
        rightChild.parent = node.parent;
        if(!node.parent) {
            this.root = rightChild;
        } else if(node === node.parent.left) {
            node.parent.left = rightChild;
        } else{
            node.parent.right = rightChild;
        }
        rightChild.left = node;
        node.parent = rightChild;
    }

    private rotateRight(node: Hawaiian): void { // (Cormen et al., 2022, p. 336)    
        const leftChild = node.left!;
        node.left = leftChild.right;
        if(leftChild.right) {
            leftChild.right.parent = node;
        }
        leftChild.parent = node.parent;
        if(!node.parent) {
            this.root = leftChild;
        } else if(node === node.parent.left) {
            node.parent.left = leftChild;
        } else {
            node.parent.right = leftChild;
        }
        leftChild.right = node;
        node.parent = leftChild;
    }
    /*  The rotateLeft and rotateRight methods are important operations to maintain balance for a red-black tree. When the Insert or Delete
        operations are run on a red-black tree, they modify the tree and the result might violate the properties of the tree. For example: 
        Every node is either red or black; The root is black; Every leaf (NIL) is black; If a node is red, then both its children are black;
        For each node, all simple paths from the node to descendant leaved contain the same number of black nodes. the rotate methods help 
        restore this balance by adjusting the structure of the tree. These operations are performed in constant time O(1), while the rest of 
        the tree operations are able to stay within O(log n). (Cormen et al., 2022, p. 335) */

    private fixInsert(node: Hawaiian): void { // (Cormen et al., 2022, p. 339)
        while(node.parent && node.parent.color) {
            if(node.parent === node.parent.parent!.left) {
                const uncle = node.parent.parent!.right;
                if(uncle && uncle.color) {
                    node.parent.color = false;
                    uncle.color = false;
                    node.parent.parent!.color = true;
                    node = node.parent.parent!;
                } else {
                    if (node === node.parent.right) {
                        node = node.parent;
                        this.rotateLeft(node);
                    }
                    node.parent!.color = false;
                    node.parent!.parent!.color = true;
                    this.rotateRight(node.parent!.parent!);
                }
            } else {
                const uncle = node.parent.parent!.left;
                if(uncle && uncle.color) {
                    node.parent.color = false;
                    uncle.color = false;
                    node.parent.parent!.color = true;
                    node = node.parent.parent!;
                } else {
                    if(node === node.parent.left) {
                        node = node.parent;
                        this.rotateRight(node);
                    }
                    node.parent!.color = false;
                    node.parent!.parent!.color = true;
                    this.rotateLeft(node.parent!.parent!);
                }
            }
        }
        this.root!.color = false;
    }
    /*  The fixInsert or Insert Fixup method is another critical part to maintain balance and property rules of a red-black tree after the
        insertion of a new node. It is effective because it is able to fix these property violations by either "recoloring" parent or uncle 
        nodes or by performing a left or right rotation on the tree to rebalance the nodes. By using while loops, the algorithm is able to 
        efficiently continue fixing the tree until the property rules are restored. (Cormen et al., 2022, p. 338) */

    member(saying: string): boolean { 
        let current = this.root;
        while(current) {
            if(saying === current.key) {
                return true;
            } else if(saying < current.key) {
                current = current.left;
            } else {
                current = current.right;
            }
        }
        return false;
    }
    /*  The member method is a standard operation for searching a specific key in a BST. It is effective and efficient because its able to
        quick searches with a time complexity of O(log n) in balanced trees. The method is designed 
        to terminate early if the key is found, ensuring that unnecessary computations are avoided. While its worst-case performance may 
        degrade in unbalanced trees, because it is used in a red-black tree, worst-case time can be avoided. */

    first(): string | null { // (Cormen et al., 2022, p. 318)
        let current = this.root;
        if (!current) return null; 
        while (current.left) {
            current = current.left;
        }
        return current.key;
    }

    last(): string | null { // (Cormen et al., 2022, p. 318)
        let current = this.root;
        if (!current) return null; 
        while (current.right) {
            current = current.right;
        }
        return current.key;
    }
    /*  The first and last methods are another standard operation for a BST. They are designed to find and return the smallest or largest 
        key in the tree. The methods moves iteratively to the first or last node and since their able to avoid moving through unnecessary 
        areas of the tree, it can efficiently narrow down its search area. Because of the use of a red-black tree and the tree stays 
        balanced because of it, the time complexity is able to avoid a worst case and stay at O(log n) making the method very efficient.
        This method works effectively by checking for an empty tree and exiting early so there is no unnecessary operations. */

    predecessor(saying: string): string { // (Cormen et al., 2022, p. 319)
        let current = this.findNode(saying);
        if(!current) return current!.key;
        if(current.left) {
            current = current.left;
            while(current.right) {
                current = current.right;
            }
            return current.key;
        }
        let parent = current.parent;
        while(parent && current === parent.left) {
            current = parent;
            parent = parent.parent;
        }
        return parent!.key;
    }

    successor(saying: string): string { // (Cormen et al., 2022, p. 319)
        let current = this.findNode(saying);
        if(!current) return current!.key;
        if(current.right) {
            current = current.right;
            while(current.left) {
                current = current.left;
            }
            return current.key;
        }
        let parent = current.parent;
        while(parent && current === parent.right) {
            current = parent;
            parent = parent.parent;
        }
        return parent!.key;
    }
    /*  The predecessor and successor methods are designed to find the in-order node of the BST. The successor method is able to effectively 
        handle the two cases of either the node having a "right" child or not by moving up or down the tree. These directions limit the amount 
        of nodes needed to visit. This makes it so the smallest key larger than the "current" is found without having to travel unnecessary 
        parts of the tree. The predecessor method works symmeetricly to the predecessor method. Since the red-black tree keeps the tree 
        balanced. these methods are able to efficiently traverse large trees in O(log n). */

    private findNode(saying: string): Hawaiian | void { // (Cormen et al., 2022, p. 316)
        let current = this.root;
        while (current) {
            if (saying === current.key) {
                return current;
            } else if (saying < current.key) {
                current = current.left;
            } else {
                current = current.right;
            }
        }
        return console.log("Saying not found.");
    }
    /*  The findNode method works similarily to the member method. It is used to quickly find the node in the BST that matches the given key.*/
    
    insert(saying: string, value: {translation: string; explanation: {english: string; hawaiian: string}}): void { // (Cormen et al., 2022, p. 338) 
        const newNode = new Hawaiian(saying, value);
        let parent: Hawaiian | null = null;
        let current: Hawaiian | null = this.root;
        while(current) {
            parent = current;
            if(newNode.key < current.key) {
                current = current.left;
            } else {
                current = current.right;
            }
        }
        newNode.parent = parent;
        if(!parent) {
            this.root = newNode;
        } else if(newNode.key < parent.key) {
            parent.left = newNode;
        } else {
            parent.right = newNode;
        }
        this.fixInsert(newNode);
    }
    /* The */
    meHua(word: string): Array<{saying: string}> {
        const results: Array<{saying: string}> = [];
        const search = (node: Hawaiian | null) => {
            if(node) {
                search(node.left);
                if(node.key.includes(word)) {
                    results.push({saying: node.key});
                }
                search(node.right);
            }
        };
        search(this.root);
        return results;
    }

    withWord(word: string): Array<{saying: string}> {
        const results: Array<{saying: string}> = []; 
        const search = (node: Hawaiian | null) => {
            if(node) {
                search(node.left);
                if(node.value.translation.includes(word)) {
                    results.push({saying: node.key});
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
tree.insert("'A'ahu 'ili kao", {translation: "Wearer of goat hide", explanation: {english: "An expression of contempt for a person who is so lazy he uses goat hides instead of mats, which require work to make, for his bedding. Such a person is recognized by his goaty odor.", hawaiian: "He hoike hoowahawaha i ke kanakaʻO ka mea palaualelo, hoʻohana ʻo ia i ka ʻili kaoma kahi o ka moena e pono ai ka hanae hana, no kona wahi moe. ʻO ia ʻano aʻike ʻia ke kanaka e kona ʻala kao."}}); // (Pukui, 1983, p. 3)
tree.insert("A 'ai ka manu i luna.", {translation: "The birds feed above.", explanation: {english: "An attractive person is compared to a flower-laden tree that attracts birds.", hawaiian: "Hoʻohālikelike ʻia ke kanaka uʻi me a lāʻau pua e hoʻohihi manu."}}); // (Pukui, 1983, p. 3)
tree.insert("E 'ai i ka mea i loa'a.", {translation: "What you have, eat.", explanation: {english: "Be satisfied with what you have.", hawaiian: "E māʻona i kāu mea i loaʻa."}}); // (Pukui, 1983, p. 31)
tree.insert("E ala, e hoa i ka malo.", {translation: "Get up and gird your loincloth.", explanation: {english: "A call to rise and get to work.", hawaiian: "He kāhea e ala a hele i ka hana."}}); // (Pukui, 1983, p. 32)
tree.insert("Ha'alele 'ia i muhwa'a.", {translation: "Left on the very last canoe.", explanation: {english: "Said of one who is left behind.", hawaiian: "Wahi a kekahi i waiho ʻia."}}); // (Pukui, 1983, p. 49)
tree.insert("Ha'alele o Makanikeoe.", {translation: "Makanikeoe has departed.", explanation: {english: "Peace and love are no longer here.", hawaiian: "ʻAʻohe maluhia a me ke aloha."}}); // (Pukui, 1983, p. 50)
tree.insert("I hele no ka hola i'a i ka lā.", {translation: "Poison fish while it is day.", explanation: {english: "It is better to work during the day.", hawaiian: "ʻOi aku ka maikaʻi o ka hana i ka lā."}}); // (Pukui, 1983, p. 126)
tree.insert("Ihea no ka lima a 'au mai?", {translation: "Where are the arms with which to swim?", explanation: {english: "Don't complain, use your limbs to do what you need to do.", hawaiian: "Mai ʻōhumu, e hoʻohana i kou mau lālā e hana i kāu mea e pono ai ke hana."}}); // (Pukui, 1983, p. 126)
tree.insert("Ka 'ai niho 'ole a ka makani i ka 'ai.", {translation: "Even without teeth the wind consumes the food crops.", explanation: {english: "Said of a destructive windstorm.", hawaiian: "Ua ʻōlelo ʻia no ka makani ʻino."}}); // (Pukui, 1983, p. 139)
tree.insert("Ka'a ka pōhaku.", {translation: "The stones roll.", explanation: {english: "Thunder.", hawaiian: "Hekili."}}); // (Pukui, 1983, p. 140)
tree.insert("Lāhui pua o lalo.", {translation: "The many flowers below.", explanation: {english: "The commoners.", hawaiian: "ʻO nā makaʻāinana."}}); // (Pukui, 1983, p. 209)
tree.insert("La'i lua ke kai.", {translation: "The sea is very calm.", explanation: {english: "All is peaceful.", hawaiian: "Ua maluhia nā mea a pau."}}); // (Pukui, 1983, p. 209)
tree.insert("Māhanalua na kukui.", {translation: "The lights are doubled.", explanation: {english: "Said of a drunk person who sees double.", hawaiian: "Wahi a kekahi kanaka ʻona ʻike pālua."}}); // (Pukui, 1983, p. 221)
tree.insert("Mai ka ā a ka w.", {translation: "From A to W.", explanation: {english: "The alphabet of Hawaiian.", hawaiian: "ʻO ka pīʻāpā o ka ʻōlelo Hawaiʻi."}}); // (Pukui, 1983, p. 223)
tree.insert("Nahā ka mākāhā, lele ka 'upena.", {translation: "When the sluice gate breaks, the fishnets are lowerd. ", explanation: {english: "One's loss may be another's gain.", hawaiian: "ʻO ka lilo o kekahi, ʻo ia ka waiwai o kekahi."}}); // (Pukui, 1983, p. 242)
tree.insert("Na kai 'ewalu.", {translation: "The eight seas.", explanation: {english: "The \"seas\" that divide the eight inhabited islands.", hawaiian: "ʻO nā \"kai\" e māhele ana i ka ʻewalu mokupuni kanaka."}}); // (Pukui, 1983, p. 243)
tree.insert("'Ohi aku ka pō a koe kêia.", {translation: "The night has taken all but this one.", explanation: {english: "All are dead; this is the only survivor.", hawaiian: "Ua make nā mea a pau; ʻo kēia wale nō ke ola."}}); // (Pukui, 1983, p. 258)
tree.insert("'Ōhule ke po'o i niania.", {translation: "Bald of head and smooth.", explanation: {english: "Said of a bald-headed man.", hawaiian: "Wahi a kekahi kanaka ʻōhule."}}); // (Pukui, 1983, p. 260)
tree.insert("Pa'a ka moku i ka helēuma.", {translation: "The ship is heldfast by the anchor.", explanation: {english: "Said of one who is married.", hawaiian: "Wahi a kekahi i male."}}); // (Pukui, 1983, p. 281)
tree.insert("Pa'a no ka 'aihue i ka 'ole", {translation: "A thief persists in denying his guilt.", explanation: {english: "A thief is also a liar.", hawaiian: "He wahahee ka aihue."}}); // (Pukui, 1983, p. 282)

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

- Cormen TH, Leiserson CE, Rivest RL, Stein C. Introduction to Algorithms Thomas H. Cormen Aut; Charles E. Leiserson Aut; Ronald L. Rivest Aut; 
  Clifford Stein Aut. The MIT Press; 2022. */
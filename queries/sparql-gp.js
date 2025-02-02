var separator = require("../config").separator;

module.exports = {

    /**
     * Retrieve all models and describe their Gene Products
     */
    getAllGPsModels() {
        var encoded = encodeURIComponent(`
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#> 
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX metago: <http://model.geneontology.org/>
        
        PREFIX enabled_by: <http://purl.obolibrary.org/obo/RO_0002333>
        PREFIX in_taxon: <http://purl.obolibrary.org/obo/RO_0002162>
        
        SELECT ?identifier	(GROUP_CONCAT(distinct ?gocam;separator=",") as ?gocams)
        
        WHERE 
        {
        
          GRAPH ?gocam {
            ?gocam metago:graphType metago:noctuaCam .    
            ?s enabled_by: ?gpnode .    
            ?gpnode rdf:type ?identifier .
            FILTER(?identifier != owl:NamedIndividual) .         
          }
          
        }
        GROUP BY ?identifier        
        `);
        return "?query=" + encoded;
    },

    /**
     * Retrieve all models for a given Gene Product
     * @param {*} id Gene Product IRI (e.g. http://identifiers.org/zfin/ZDB-GENE-000403-1)
     */
    getGPModels(id) {
        var encoded = encodeURIComponent(`
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#> 
        PREFIX metago: <http://model.geneontology.org/>
        PREFIX dc: <http://purl.org/dc/elements/1.1/>
        PREFIX enabled_by: <http://purl.obolibrary.org/obo/RO_0002333>
        
        SELECT distinct ?gocam ?title
        
        WHERE 
        {
        
          GRAPH ?gocam {
            ?gocam metago:graphType metago:noctuaCam .    
            ?s enabled_by: ?gpnode .    
            ?gpnode rdf:type ?identifier .
            ?gocam dc:title ?title .   
            FILTER(?identifier = <` + id + `>) .            
          }
        
        }
        ORDER BY ?gocam
        `);
        return "?query=" + encoded;
    },

    getGPModelsWith2CausalMFs(id) {
      var encoded = encodeURIComponent(`
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX pr: <http://purl.org/ontology/prv/core#>
      PREFIX metago: <http://model.geneontology.org/>
      PREFIX dc: <http://purl.org/dc/elements/1.1/>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX obo: <http://www.geneontology.org/formats/oboInOwl#>
      PREFIX owl: <http://www.w3.org/2002/07/owl#>
      PREFIX providedBy: <http://purl.org/pav/providedBy>
      PREFIX MF: <http://purl.obolibrary.org/obo/GO_0003674>
      PREFIX causally_upstream_of_or_within: <http://purl.obolibrary.org/obo/RO_0002418>
      PREFIX causally_upstream_of_or_within_negative_effect: <http://purl.obolibrary.org/obo/RO_0004046>
      PREFIX causally_upstream_of_or_within_positive_effect: <http://purl.obolibrary.org/obo/RO_0004047>
      PREFIX causally_upstream_of: <http://purl.obolibrary.org/obo/RO_0002411>
      PREFIX causally_upstream_of_negative_effect: <http://purl.obolibrary.org/obo/RO_0002305>
      PREFIX causally_upstream_of_positive_effect: <http://purl.obolibrary.org/obo/RO_0002304>
      PREFIX regulates: <http://purl.obolibrary.org/obo/RO_0002211>
      PREFIX negatively_regulates: <http://purl.obolibrary.org/obo/RO_0002212>
      PREFIX positively_regulates: <http://purl.obolibrary.org/obo/RO_0002213>
      PREFIX directly_regulates: <http://purl.obolibrary.org/obo/RO_0002578>
      PREFIX directly_positively_regulates: <http://purl.obolibrary.org/obo/RO_0002629>
      PREFIX directly_negatively_regulates: <http://purl.obolibrary.org/obo/RO_0002630>
      PREFIX directly_activates: <http://purl.obolibrary.org/obo/RO_0002406>
      PREFIX indirectly_activates: <http://purl.obolibrary.org/obo/RO_0002407>
      PREFIX directly_inhibits: <http://purl.obolibrary.org/obo/RO_0002408>
      PREFIX indirectly_inhibits: <http://purl.obolibrary.org/obo/RO_0002409>
      PREFIX transitively_provides_input_for: <http://purl.obolibrary.org/obo/RO_0002414>
      PREFIX immediately_causally_upstream_of: <http://purl.obolibrary.org/obo/RO_0002412>
      PREFIX directly_provides_input_for: <http://purl.obolibrary.org/obo/RO_0002413>
      PREFIX enabled_by: <http://purl.obolibrary.org/obo/RO_0002333>
      PREFIX hint: <http://www.bigdata.com/queryHints#>
      SELECT DISTINCT ?gocam ?title
      WHERE {
        GRAPH ?gocam {  
          # Inject gene product ID here
          ?gene rdf:type <` + id + `> .
        }
        ?gocam metago:graphType metago:noctuaCam .
        ?gocam dc:title ?title .
        GRAPH ?gocam {
          VALUES ?causal { causally_upstream_of_or_within: causally_upstream_of_or_within_negative_effect: causally_upstream_of_or_within_positive_effect: causally_upstream_of: causally_upstream_of_negative_effect: causally_upstream_of_positive_effect: regulates: negatively_regulates: positively_regulates: directly_regulates: directly_positively_regulates: directly_negatively_regulates: directly_activates: indirectly_activates: directly_inhibits: indirectly_inhibits: transitively_provides_input_for: immediately_causally_upstream_of: directly_provides_input_for: }
          VALUES ?causal2 { causally_upstream_of_or_within: causally_upstream_of_or_within_negative_effect: causally_upstream_of_or_within_positive_effect: causally_upstream_of: causally_upstream_of_negative_effect: causally_upstream_of_positive_effect: regulates: negatively_regulates: positively_regulates: directly_regulates: directly_positively_regulates: directly_negatively_regulates: directly_activates: indirectly_activates: directly_inhibits: indirectly_inhibits: transitively_provides_input_for: immediately_causally_upstream_of: directly_provides_input_for: }
          #?s enabled_by: ?gpnode . # I don't think this is needed for this query
          #?gpnode rdf:type ?identifier . # I don't think this is needed for this query
          ?ind1 enabled_by: ?gpnode1 .
          ?ind2 enabled_by: ?gpnode2 .
          ?ind3 enabled_by: ?gpnode3 .
          ?ind1 ?causal ?ind2 .
          ?ind2 ?causal2 ?ind3 .
          ?gpnode1 rdf:type ?gp1 .
          ?gpnode2 rdf:type ?gp2 .
          ?gpnode3 rdf:type ?gp3 .
          # Inject gene product ID here
          FILTER(?gp1 = <` + id + `> || ?gp2 = <` + id + `> || ?gp3 = <` + id + `>)  
        }
        FILTER EXISTS {
          ?ind1 rdf:type MF: .
        }
        FILTER EXISTS {
          ?ind2 rdf:type MF: .
        }
        FILTER EXISTS {
          ?ind3 rdf:type MF: .
        }
      }
      ORDER BY ?gocam
      `);
      return "?query=" + encoded;
    }


}

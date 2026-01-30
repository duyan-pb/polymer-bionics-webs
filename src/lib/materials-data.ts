/**
 * Materials Data
 * 
 * Seed data for the materials catalog.
 * Contains biomaterial specifications.
 * 
 * @module lib/materials-data
 */

import type { Material } from './types'

/**
 * Biomaterials catalog.
 * 
 * Each material represents a unique polymer or composite developed
 * by Polymer Bionics for medical device applications.
 */
export const materials: Material[] = [
  {
    id: 'flexelec',
    name: 'FlexElec',
    description: 'FlexElec is a conductive elastomer designed to function as a standalone soft, flexible electrode, while also offering the flexibility to be applied as a conformal coating where required. It enables adaptive bioelectronic interfaces that conform to the body while maintaining reliable electrical performance. FlexElec is suitable for both dry wearable technologies and implantable devices.',
    properties: [
      'Adaptive mechanical compliance',
      'Stretchable elastomeric structure',
      'Stable electrical conductivity'
    ],
    keyAdvantages: [
      'Standalone or coating-compatible – can act as the electrode itself or be applied to existing structures',
      'Format-flexible – supports single electrodes, arrays, and complex device geometries',
      'Cross-platform compatible – suitable for dry wearables and implantable bioelectronic systems'
    ],
    technicalDetails: 'FlexElec is a conductive elastomer engineered to balance electrical performance with soft mechanical behaviour. Its elastomeric matrix supports deformation and stretch without loss of conductivity, enabling intimate contact with tissue or skin. The material can be processed into a range of electrode formats and integrated into devices without relying on stiff metallic layers or high-temperature processing.',
    imageClass: 'bg-gradient-to-br from-accent/20 to-primary/10'
  },
  {
    id: 'biongel',
    name: 'BionGel',
    description: 'BionGel is a biocompatible hydrogel coating designed to improve the interface between electrodes and biological tissue. It can be applied to existing metal or polymer electrodes, enabling retrofit of established device designs. BionGel reduces effective stiffness at the tissue interface while supporting long-term surface stability.',
    properties: [
      'Biocompatible hydrogel composition',
      'Conformal surface coating',
      'Anti-fouling behaviour'
    ],
    keyAdvantages: [
      'Retrofit capability – enhances existing devices without redesign',
      'Mechanical decoupling – reduces stiffness mismatch at the tissue interface',
      'Surface stability – limits fouling to support consistent electrical performance'
    ],
    technicalDetails: 'BionGel is formulated to form a compliant, hydrated interface layer between electrodes and tissue. By damping mechanical mismatch, it improves conformity and comfort without altering the underlying device structure. Its surface properties are designed to reduce fouling and degradation, supporting stable performance in both implantable and wearable bioelectronic systems.',
    imageClass: 'bg-gradient-to-br from-primary/20 to-accent/10'
  },
  {
    id: 'elastisolder',
    name: 'ElastiSolder',
    description: 'ElastiSolder is a conductive interconnect paste designed to electrically and mechanically connect soft elastomeric components with metallic elements in bioelectronic devices. It enables hybrid device architectures without the need for high-temperature curing or sintering. ElastiSolder is compatible with a wide range of medical-grade metals commonly used in implantable systems.',
    properties: [
      'Low-temperature curing',
      'Electrical conductivity',
      'Mechanical flexibility'
    ],
    keyAdvantages: [
      'Electronics-compatible processing – avoids high-temperature curing and sintering',
      'Mechanically robust connections – maintains conductivity under flexing and deformation',
      'Metal-compatible – forms reliable connections with common medical-grade implant metals'
    ],
    technicalDetails: 'ElastiSolder is engineered to address a common limitation in bioelectronic assembly, where rigid metallic interconnects compromise flexibility and reliability. The material cures at low temperature, preserving compatibility with sensitive electronics and soft materials. Its conductive and compliant formulation supports durable electrical connections in hybrid elastomer–metal devices for wearable and implantable applications.',
    imageClass: 'bg-gradient-to-br from-primary/10 to-accent/20'
  }
]

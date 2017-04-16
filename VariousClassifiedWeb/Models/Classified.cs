//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace VariousClassifiedWeb.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class Classified
    {
        public int ClassifiedID { get; set; }
        public string ClassifiedTitle { get; set; }
        public string ClassifiedDescription { get; set; }
        public Nullable<int> CategoryID { get; set; }
        public string ClassfiedImage { get; set; }
        public Nullable<System.DateTime> FromDate { get; set; }
        public Nullable<System.DateTime> ToDate { get; set; }
        public Nullable<bool> IsActive { get; set; }
        public string ContactDetails { get; set; }
        public string Notes { get; set; }
        public string RefNo { get; set; }
        public Nullable<int> UserID { get; set; }
    
        public virtual Category Category { get; set; }
        public virtual User User { get; set; }
    }
}
